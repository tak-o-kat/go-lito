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

const PORT_DEFAULT = "8081"

type Server struct {
	port   int
	logger *zerolog.Logger
	db     database.Service
}

func NewServer(l *zerolog.Logger, cfg *lito.Config) *http.Server {
	portNum, _ := os.LookupEnv("PORT")
	if portNum == "" {
		portNum = cfg.Port
	}

	if cfg.Port != PORT_DEFAULT {
		portNum = cfg.Port
	}

	port, _ := strconv.Atoi(portNum)

	NewServer := &Server{
		port:   port,
		logger: l,
		db:     database.New(l, cfg.LitoPath, cfg.Database),
	}

	// Declare Server config
	server := &http.Server{
		Addr:         fmt.Sprintf(":%d", NewServer.port),
		Handler:      NewServer.RegisterRoutes(),
		IdleTimeout:  time.Minute,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 30 * time.Second,
	}

	l.Info().Msg(fmt.Sprintf("Starting server on port %d", NewServer.port))

	return server
}
