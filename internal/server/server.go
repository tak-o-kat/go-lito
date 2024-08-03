package server

import (
	"fmt"
	"go-lito/cmd/lito"
	"go-lito/internal/database"
	"net/http"
	"os"
	"strconv"
	"time"

	_ "github.com/joho/godotenv/autoload"
	"github.com/rs/zerolog"
)

type Server struct {
	port   int
	logger *zerolog.Logger
	db     database.Service
}

func NewServer(l *zerolog.Logger) *http.Server {
	port, _ := strconv.Atoi(os.Getenv("PORT"))
	path := lito.GetLitoPath()

	NewServer := &Server{
		port:   port,
		logger: l,
		db:     database.New(l, path, "golito.db"),
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
