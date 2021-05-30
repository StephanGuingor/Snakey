package main

import (
	"./config"
	"./resources"
	"fmt"
	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/cors"
	"github.com/jinzhu/gorm"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"log"

	// Import GORM-related packages.
	//"github.com/cockroachdb/cockroach-go/crdb/crdbgorm"
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

func init() {
	err := godotenv.Load("src/.env")
	if err != nil {
		fmt.Println(err)
		return
	}
	config.InitDB()
}
// main sets the database connection, sets the endpoints and starts the server
func main() {
	// Will close the database at the end of the
	defer func(db *gorm.DB) {
		err := db.Close()
		if err != nil {
			log.Fatal("Couldn't close database!")
		}
	}(config.GetDB())
	// Router Setup
	router = chi.NewRouter()
	// Set Up Middlewares
	router.Use(middleware.Logger)
	router.Use(middleware.Recoverer)
	router.Use(cors.Handler(cors.Options{
		// AllowedOrigins:   []string{"https://foo.com"}, // Use this to allow specific origin hosts
		AllowedOrigins:   []string{"https://*", "http://*","*"},
		// AllowOriginFunc:  func(r *http.Request, origin string) bool { return true },
		AllowedMethods:   []string{"GET", "POST"},
		AllowedHeaders:   []string{"X-PINGOTHER","Accept", "Authorization", "Content-Type", "X-CSRF-Token","Access-Control-Allow-Origin"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: false,
		MaxAge:           300, // Maximum value not ignored by any of major browsers
	}))
	// Set Routes

	routers()
	// Serve
	err := http.ListenAndServe(":5000", router)
	if err != nil {
		log.Fatal("Couldn't start server")
		return
	}
	log.Println("GO API Started!")
}

// routers sets the endpoints
func routers() *chi.Mux {
	router.Get("/scores",resources.AllUserScores)
	router.Post("/scores",resources.AddUserScore)
	return router
}

