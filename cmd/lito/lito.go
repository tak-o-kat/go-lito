package lito

import (
	"fmt"
	"os"

	"go-lito/internal/database"
	"go-lito/internal/misc"

	_ "github.com/joho/godotenv/autoload"
	"github.com/rs/zerolog"
)

type AlgodInfo struct {
	url string
	token string
	ArchivePath string
	ArchiveFile string
	PartAccount string
}

type LitoApp struct {
	AlgodInfo *AlgodInfo
	Logger *zerolog.Logger
	DB database.Service
}

func Init() *LitoApp {
	// Check to see if the .env file exists
	if _, err := os.Stat(".env"); os.IsNotExist(err) {
	  panic(err)
	}

	// Get a new zerolog logger
	logger := misc.NewLogger()
	misc.LoadEnvSettings(logger)

	// Get algod info
	algodInfo := NewAlgodInfo(logger, os.Getenv("LOG_FILE"))

	// Run prerequisites
	err := Prerequisites(algodInfo)
	if err != nil {
		logger.Fatal().Msg(fmt.Sprintf("%s",err))
	}

	logger.Info().Msg("algod running and prequisites passed")
	logger.Debug().Msg("Part Account: " + algodInfo.PartAccount)

	path := GetLitoPath()
	file := os.Getenv("DB_NAME")

	logger.Debug().Msgf("DB path: %v - DB file: %v", path, file)

	// Set up database and create tables if needed
	dbInstance := database.New(logger, path, file)
	exists := dbInstance.CheckDefaultTables()
	if !exists {
		dbInstance.CreateTables()
	} else {
		logger.Debug().Msg("Tables already exist")
	}

	// Set up LitoApp struct
	lito := &LitoApp{
		AlgodInfo: algodInfo,
		Logger: logger,
		DB: dbInstance,
	}	
	
	return lito
}

func (l *LitoApp) Run() error {
	// Ensure database connection is closed when app exits
	defer l.DB.Close()

	l.Logger.Debug().Msg("Starting Watcher")
	// Begin watcher on archive file
	l.Watcher()

	return nil
}
