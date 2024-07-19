package lito

import (
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
	// run prerequisites
	


	// run server

	return nil
}


