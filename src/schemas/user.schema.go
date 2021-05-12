package schemas

import (
	"regexp"
	"time"
)

var rUser = regexp.MustCompile("^[a-zA-z0-9]+$")

// User Used to encode and decode JSON and to map objects to the database
type User struct {
	ID uint `gorm:"primaryKey" json:"-"`
	CreatedAt time.Time `json:"-"` // Set to current time if it is zero on creating
	Username string `gorm:"unique" json:"username"`
	Scores []Score `gorm:"ForeignKey:UserID" json:"scores"`
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