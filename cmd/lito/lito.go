package lito

import (
	"fmt"
	"os"

	"go-lito/internal/database"

	_ "github.com/joho/godotenv/autoload"
	"github.com/rs/zerolog"
)

type Config struct {
	EnvVar   string // Algod data environment variable
	LitoPath string // Lito folder path
	Database string // Database file
	LogFile  string // Algod archive Log file to parse/watch
	Output   string // Output log file to store lito logs
	Loglevel string // Set log level
	Account  string // Set participation account
	Port     string // Server port
}

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

func Init(logger *zerolog.Logger, cfg *Config) *LitoApp {
	// Check the algod data env variable
	err := CheckEnvVar(cfg.EnvVar)
	if err != nil {
		logger.Fatal().Msg(fmt.Sprintf("%s", err))
	}

	// Get algod info'
	algodInfo := NewAlgodInfo(logger, cfg)

	// Run prerequisites
	err = Prerequisites(algodInfo, cfg)
	if err != nil {
		logger.Fatal().Msg(fmt.Sprintf("%s", err))
	}

	logger.Info().Msg("algod running and prequisites passed")
	logger.Debug().Msg("Part Account: " + algodInfo.PartAccount)

	path := cfg.LitoPath

	var file string
	file, isSet := os.LookupEnv("DB_NAME")
	if !isSet || file == "" {
		// if not set use default
		file = cfg.Database
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
	logger.Info().Msg("DB setup complete")
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
