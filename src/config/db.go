package config

import (
	"../schemas"
	"fmt"
	"github.com/jinzhu/gorm"
	"log"
	"os"
)

var DB *gorm.DB

func InitDB() {
	// This should be protected
	username := os.Getenv("USER_NAME")
	password := os.Getenv("PASSWORD")
	host := os.Getenv("HOST")
	port := os.Getenv("PORT")
	dbname := os.Getenv("DB_NAME")

	addr := fmt.Sprintf("postgresql://%s%s:@%s:%s/%s?sslmode=disable",username,password,host,port,dbname)
	db, err := gorm.Open("postgres", addr)
	if err != nil {
		log.Fatal(err)
	}

	db.LogMode(true)
	db.AutoMigrate(&schemas.User{},&schemas.Score{})

	DB = db
}

func GetDB() *gorm.DB {
	return DB
}