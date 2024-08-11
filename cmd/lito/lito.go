package lito

import (
	"fmt"
	"os"

	"go-lito/internal/database"

	_ "github.com/joho/godotenv/autoload"
	"github.com/rs/zerolog"
)

type AlgodInfo struct {
	url         string
	token       string
	ArchivePath string
	ArchiveFile string
	PartAccount string
}

type LitoApp struct {
	AlgodInfo *AlgodInfo
	Logger    *zerolog.Logger
	DB        database.Service
}

func Init(dbCreated chan<- bool, logger *zerolog.Logger) *LitoApp {
	// Get a new zerolog logger
	// logger := misc.NewLogger()
	// misc.LoadEnvSettings(logger)

	// Get algod info
	algodInfo := NewAlgodInfo(logger, os.Getenv("LOG_FILE"))

	// Run prerequisites
	err := Prerequisites(algodInfo)
	if err != nil {
		logger.Fatal().Msg(fmt.Sprintf("%s", err))
	}

	logger.Info().Msg("algod running and prequisites passed")
	// logger.Debug().Msg("Part Account: " + algodInfo.PartAccount)

	path := GetLitoPath()
	file, isSet := os.LookupEnv("DB_NAME")
	if !isSet || file == "" {
		// if not set use default
		logger.Info().Msg("DB_NAME env variable not set or empty, using default")
		file = "golito.db"
	}

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
		Logger:    logger,
		DB:        dbInstance,
	}

	// After all the prerequisites are done inform the http server
	dbCreated <- true

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
