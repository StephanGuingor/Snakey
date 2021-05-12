package main

import (
	"./config"
	"./resources"
	"fmt"
	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
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

// main sets the database connection, sets the endpoints and starts the server
func main() {
	err := godotenv.Load("src/.env")
	if err != nil {
		fmt.Println(err)
		return
	}

	config.InitDB()
	// Router Setup
	router = chi.NewRouter()
	// Set Up Middlewares
	router.Use(middleware.Logger)
	router.Use(middleware.Recoverer)
	// Set Routes

	routers()
	// Serve
	http.ListenAndServe(":5000",router)
}

// routers sets the endpoints
func routers() *chi.Mux {
	router.Get("/scores",resources.AllUserScores)
	router.Post("/scores",resources.AddUserScore)
	return router
}

