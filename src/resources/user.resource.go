package resources

import (
	"../models"
	"../schemas"
	"encoding/json"
	"net/http"
)

// If we added more enpoints, this should go into its own file. To have a clean setup for endpoints / resources

// AllUserScores Endpoint Handler, returns all scores by a player
func AllUserScores(w http.ResponseWriter, r *http.Request) {
	// We will attempt to send json data
	w.Header().Set("Content-Type", "application/json")

	user := schemas.User{ Username: r.URL.Query().Get("name")}

	// Validates user data received by client
	if  !user.Validate() {
		w.WriteHeader(400) // bad request
		errorMsg, _ := json.Marshal(user.Errors)
		w.Write(errorMsg)
		return
	}
	// Get Data
	result, _ := models.FindUserByUsername(user.Username)
	marshal, _ := json.Marshal(&result)

	w.WriteHeader(200) // ok
	w.Write(marshal)

}

// AddUserScore Adds score to player, if player doesnt exist it creates it.
func AddUserScore(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	decoder := json.NewDecoder(r.Body)

	type Response struct { // local type, exclusive for this response
		Points int `json:"points"`
		Username string `json:"username"`
	}

	var response Response
	err := decoder.Decode(&response)

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
	if response.Points < 0 {
		w.WriteHeader(400)
		msgMap := make(map[string]string)
		msgMap["points"] = "Invalid value for points, value should be positive"
		msgError, _ := json.Marshal(msgMap)
		w.Write(msgError)
		return
	}
	user := schemas.User{
		Username: response.Username,
	}
	if !user.Validate() {
		w.WriteHeader(400) // bad request
		errorMsg, _ := json.Marshal(user.Errors)
		w.Write(errorMsg)
		return
	}

	// Get Data
	models.AddUserScore(user.Username,response.Points)

	w.WriteHeader(200) // ok
	msgMap := make(map[string]string)
	msgMap["msg"] = "Score Added!"
	msg, _ := json.Marshal(msgMap)
	w.Write(msg)
}
