package server

import (
	"fmt"
	"net/http"
	"os"
	"strconv"
	"time"

	_ "github.com/joho/godotenv/autoload"

	"go-lito/cmd/lito"
	"go-lito/internal/database"

	"github.com/rs/zerolog"
)

type Server struct {
	port int

	db database.Service
}

func NewServer(l *zerolog.Logger) *http.Server {
	port, _ := strconv.Atoi(os.Getenv("PORT"))
	path := lito.GetLitoPath()
	file := "golito.db"
	NewServer := &Server{
		port: port,

		db: database.New(l, path, file),
	}

	// Declare Server config
	server := &http.Server{
		Addr:         fmt.Sprintf(":%d", NewServer.port),
		Handler:      NewServer.RegisterRoutes(),
		IdleTimeout:  time.Minute,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 30 * time.Second,
	}

	return server
}
