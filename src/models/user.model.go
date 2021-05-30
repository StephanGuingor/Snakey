package models

import (
	"../config"
	"../schemas"
	"github.com/jinzhu/gorm"
)

func FindUserByUsername(name string) (schemas.User,error) {
	db := config.GetDB()
	var result = schemas.User{Username: name}
	if  err := db.Preload("Scores",func(db *gorm.DB) *gorm.DB {
		return db.Order("scores.points DESC").Limit(5)
	}).Where("username = ?",name).First(&result).Error; err != nil {

		if  gorm.IsRecordNotFoundError(err) {
			db.Create(&result)
		}

		return result,err
	}
	return result,nil
}

func AddUserScore(name string, points int)  {
	db := config.GetDB()
	result := schemas.User{ Username: name }
	if err := db.Where("username = ?",result.Username).First(&result).Error; err!=nil {
		if  gorm.IsRecordNotFoundError(err) {
			db.Create(&result)
		}
	}
	score := schemas.Score{ Points: points, UserID: result.ID }
	db.Create(&score)

}