package lito

import (
	"errors"

	_ "github.com/joho/godotenv/autoload"

	"go-lito/internal/database"
)

type app struct {
	db database.Service
}

func New() *app {
	lito := &app{
		db: database.New(),
	}	
	return lito
}

func (l *app) Run() error {
	// Ensure database connection is closed 
	defer l.db.Close()

	// run prerequisites
	


	// run server

	return errors.New("something went wrong")
}


