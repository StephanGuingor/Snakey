package schemas

import "time"

// Score user has a one to many relation with score, stored in another table to keep all scores
type Score struct {
	ID uint `gorm:"primaryKey" json:"-"`
	CreatedAt time.Time `json:"-"`// Set to current time if it is zero on creating
	Points int `json:"points"`
	UserID uint `json:"-" gorm:"column:user_id"`
}
