package lito

import (
	"fmt"
	"os"
	"path/filepath"

	"go-lito/internal/database"

	_ "github.com/joho/godotenv/autoload"
	"github.com/rs/zerolog"
)

type AlgodInfo struct {
	url string
	token string
	archivePath string
	archiveFile string
	partAccount string
}

type LitoApp struct {
	algodInfo *AlgodInfo
	Logger *zerolog.Logger
	db database.Service
}

func Init() *LitoApp {
	// Check to see if the .env file exists
	if _, err := os.Stat(".env"); os.IsNotExist(err) {
	  panic(err)
	}

	// Get a new zerolog logger
	logger := NewLogger()

	// Set up the archive file to be used
	archiveLog := "node.test.log"
	archivePath := os.Getenv("ALGORAND_DATA")
	archiveFile := filepath.Join(archivePath, archiveLog)

	// Check if archive file exists, if not create one
	exists, err := Exists(archiveFile)
	if err != nil {
		logger.Error().Msg(fmt.Sprintf("%s",err))
	}
	if !exists {
		// Create archive file
		logger.Debug().Msg("Creating archive file: " + archiveFile)
		_, err := os.Create(archiveFile)
		if err != nil {
			logger.Error().Msg(fmt.Sprintf("%s",err))
		}
	}

	// Set up default AlgodInfo
	algodInfo := &AlgodInfo{
		url: "",
		token: "",
		archivePath: archivePath,
		archiveFile: archiveFile,
		partAccount: "",
	}

	// Run prerequisites
	err = Prerequisites(algodInfo)
	if err != nil {
		logger.Fatal().Msg(fmt.Sprintf("%s",err))
	}

	logger.Info().Msg("algod running and prequisites passed")
	logger.Debug().Msg(algodInfo.partAccount)
	// Set up database and create tables if needed
	dbInstance := database.New(logger, "")
	exists = dbInstance.CheckDefaultTables(logger)
	if !exists {
		database.CreateTables(logger)
	}

	// Set up LitoApp struct
	lito := &LitoApp{
		algodInfo: algodInfo,
		Logger: logger,
		db: dbInstance,
	}	
	
	logger.Info().Msg(fmt.Sprint(lito.db.Health()))
	logger.Info().Msg("Finished initializing lito")
	return lito
}

func (l *LitoApp) Run() error {
	// Ensure database connection is closed when app exits
	defer l.db.Close(l.Logger)

	// Begin watcher on archive file
	Watcher(l)

	return nil
}
