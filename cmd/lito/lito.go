package lito

import (
	"fmt"
	"os"
	"time"

	"go-lito/internal/database"

	_ "github.com/joho/godotenv/autoload"
	"github.com/rs/zerolog"
)

type AlgodInfo struct {
	url string
	token string
}

type LitoApp struct {
	algodInfo *AlgodInfo
	Logger *zerolog.Logger
	db database.Service
}


func Init() *LitoApp {
	var level = zerolog.PanicLevel
	if os.Getenv("APP_ENV") == "local" {
		level = zerolog.DebugLevel
	}
	algodInfo := &AlgodInfo{
		url: "",
		token: "",
	}

	// Set up logger
	output := zerolog.ConsoleWriter{Out: os.Stderr, TimeFormat: time.RFC3339}
	output.FormatMessage = func(i interface{}) string {
		return fmt.Sprintf("%s", i)
	}

	// Set up global logger
	logger := zerolog.New(output).
		With().
		Caller().
		Int("pid", os.Getpid()).
		Timestamp().
		Logger().Level(level)

	// Check to see it ALGORAND_DATA is set before setting up logger
	err := CheckEnvVar()
	if err != nil {
		logger.Fatal().Msg(fmt.Sprintf("%s",err))
	}

	// Run prerequisites
	err = Prerequisites(algodInfo)
	if err != nil {
		logger.Fatal().Msg(fmt.Sprintf("%s",err))
	}

	lito := &LitoApp{
		algodInfo: algodInfo,
		Logger: &logger,
		db: database.New(&logger, ""),
	}	
		
	logger.Info().Msg(fmt.Sprint(lito.db.Health()))
	logger.Info().Msg("Finished initializing lito")
	return lito
}

func (l *LitoApp) Run() error {
	// Ensure database connection is closed when app exits
	defer l.db.Close(l.Logger)

	return nil
}
