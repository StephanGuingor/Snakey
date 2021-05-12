package main

import (
	"encoding/json"
	"fmt"
	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	_ "github.com/lib/pq"
	"log"
	"regexp"
	"time"
	// Import GORM-related packages.
	//"github.com/cockroachdb/cockroach-go/crdb/crdbgorm"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	"net/http"
)

/**
	Global Variables
Router
Database Object
Regular Expression For Validation
 */
var router *chi.Mux
var DATABASE *gorm.DB

var rUser = regexp.MustCompile("^[a-zA-z0-9]+$")

// User Used to encode and decode JSON and to map objects to the database
type User struct {
	ID uint `gorm:"primaryKey" json:"-"`
	CreatedAt time.Time `json:"-"` // Set to current time if it is zero on creating
	Username string `gorm:"unique" json:"username"`
	Scores []Score `gorm:"ForeignKey:UserID"`
	Errors map[string]string `gorm:"-" json:"-"'`
}

// Validate User method used to see if an instance has valid data
func (u *User) Validate() bool {
	u.Errors = make(map[string]string)

	match := rUser.Match([]byte(u.Username))

	if !match {
		u.Errors["username"] = "Invalid username"
	}

	return len(u.Errors) == 0
}

// Score user has a one to many relation with score, stored in another table to keep all scores
type Score struct {
	ID uint `gorm:"primaryKey" json:"-"`
	CreatedAt time.Time `json:"-"`// Set to current time if it is zero on creating
	Points int `json:"points"`
	UserID uint `json:"-" gorm:"column:user_id"`
}

// main sets the database connection, sets the endpoints and starts the server
func main() {
	// This should be protected
	username := "stephangf"
	password := ""
	host := "localhost"
	port := 26257
	dbname := "challenge"

	addr := fmt.Sprintf("postgresql://%s%s:@%s:%d/%s?sslmode=disable",username,password,host,port,dbname)
	db, err := gorm.Open("postgres", addr)
	if err != nil {
		log.Fatal(err)
	}

	db.LogMode(true)
	db.AutoMigrate(&User{},&Score{})

	// Router Setup
	router = chi.NewRouter()
	// Set Up Middlewares
	router.Use(middleware.Logger)
	router.Use(middleware.Recoverer)
	// Set Routes

	DATABASE = db
	routers()
	// Serve
	http.ListenAndServe(":5000",router)
}

// routers sets the endpoints
func routers() *chi.Mux {
	router.Get("/scores",AllScores)
	router.Post("/scores",AddScore)
	return router
}

// AllScores Endpoint Handler, returns all scores by a player
func AllScores(w http.ResponseWriter, r *http.Request) {
	// We will attempt to send json data
	w.Header().Set("Content-Type", "application/json")
	// Decode username into user object
	decoder := json.NewDecoder(r.Body)
	user := User{}
	err := decoder.Decode(&user)
	// Verify decode went well
	if err!=nil {
		w.WriteHeader(400) // bad request
		// Will be filled by different errors
		errMap := make(map[string]string)
		errMap["error"] = "Invalid Data"
		msgError, _ := json.Marshal(errMap)
		w.Write(msgError)
		return
	}
	// Validates user data received by client
	if  !user.Validate() {
		w.WriteHeader(400) // bad request
		errorMsg, _ := json.Marshal(user.Errors)
		w.Write(errorMsg)
		return
	}
	// Get Data
	var result User
	DATABASE.Preload("scores").Where("username = ?",user.Username).First(&result)
	marshal, _ := json.Marshal(&result)

	w.WriteHeader(200) // ok
	w.Write(marshal)

}

// AddScore Adds score to player, if player doesnt exist it creates it.
func AddScore(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	decoder := json.NewDecoder(r.Body)

	type Response struct { // local type, exclusive for this response
		Points int `json:"points"`
		Username string `json:"username"`
	}

	var response Response
	err := decoder.Decode(&response)
	// Validate

	//point, err := strconv.Atoi(response.Points)
	if err!=nil || response.Points < 0 {
		w.WriteHeader(400)
		msgMap := make(map[string]string)
		msgMap["points"] = "Invalid points value"
		msgError, _ := json.Marshal(msgMap)
		w.Write(msgError)
		return
	}

	user := User{
		Username: response.Username,
	}
	if !user.Validate() {
		w.WriteHeader(400) // bad request
		errorMsg, _ := json.Marshal(user.Errors)
		w.Write(errorMsg)
		return
	}
	score := Score{Points: response.Points}

	// Get Data
	var result User

	if err = DATABASE.Where("username = ?",user.Username).First(&result).Error; err!=nil {
		if  gorm.IsRecordNotFoundError(err) {
			DATABASE.Create(&user)
		}
	}
	score.UserID = result.ID
	DATABASE.Create(&score)

	w.WriteHeader(200) // ok
	msgMap := make(map[string]string)
	msgMap["msg"] = "Score Added!"
	msg, _ := json.Marshal(msgMap)
	w.Write(msg)
}
