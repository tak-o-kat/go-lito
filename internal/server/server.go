package server

import (
	"fmt"
	"go-lito/cmd/lito"
	"go-lito/internal/database"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"time"

	_ "github.com/joho/godotenv/autoload"
	"github.com/rs/zerolog"
)

const PORT_DEFAULT = "8081"

type Server struct {
	netInterface string
	port         int
	logger       *zerolog.Logger
	db           database.Service
	account      string
	logFile      string
}

func NewServer(l *zerolog.Logger, cfg *lito.Config) *http.Server {
	netInterface := os.Getenv("NET_INTERFACE")
	if cfg.NetInterface != "" {
		netInterface = cfg.NetInterface
	}

	portNum, _ := os.LookupEnv("PORT")
	if portNum == "" {
		portNum = cfg.Port
	}

	if cfg.Port != PORT_DEFAULT {
		portNum = cfg.Port
	}

	port, _ := strconv.Atoi(portNum)

	// Get the part account
	account := cfg.Account
	if account == "" {
		account = os.Getenv("ACCOUNT")
		if account == "" {
			account, _ = lito.GetAccountAddress()
		}
	}

	logFile := os.Getenv("CURRENT_LOG")
	if logFile == "" {
		logFile = "node.log"
	}

	// Create the path to the log file
	path := os.Getenv("ALGORAND_DATA")
	pathFile := filepath.Join(path, logFile)

	NewServer := &Server{
		netInterface: netInterface,
		port:         port,
		logger:       l,
		db:           database.New(l, cfg.LitoPath, cfg.Database),
		account:      account,
		logFile:      pathFile,
	}

	// Declare Server config
	server := &http.Server{
		Addr:         fmt.Sprintf("%s:%d", NewServer.netInterface, NewServer.port),
		Handler:      NewServer.RegisterRoutes(),
		IdleTimeout:  time.Minute,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 30 * time.Second,
	}

	l.Info().Msg(fmt.Sprintf("Starting server on interface %s", NewServer.netInterface))
	l.Info().Msg(fmt.Sprintf("Starting server on port %d", NewServer.port))

	return server
}
