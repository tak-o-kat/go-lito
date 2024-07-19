package lito

import (
	"fmt"

	_ "github.com/joho/godotenv/autoload"

	"go-lito/internal/database"
)

type app struct {
	apiURL string
	token string
	db database.Service
}

func Init() *app {
	lito := &app{
		apiURL: "",
		token: "",
		db: database.New(),
	}	
	return lito
}

func (l *app) Run() error {
	// Ensure database connection is closed 
	defer l.db.Close()

	// run prerequisites
	err := Prerequisites(l)

	if err != nil {
		return err
	}
	// run server

	fmt.Println(l.apiURL)
	fmt.Println(l.token)

	return nil
}
