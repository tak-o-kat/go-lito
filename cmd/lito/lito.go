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
	algodInfo := &AlgodInfo{
		url: "",
		token: "",
	}

	// Set up logger
	output := zerolog.ConsoleWriter{Out: os.Stderr, TimeFormat: time.RFC3339}
	output.FormatMessage = func(i interface{}) string {
		return fmt.Sprintf("%s", i)
	}

	logger := zerolog.New(output).With().Caller().Int("pid", os.Getpid()).Timestamp().Logger()

	// Check to see it ALGORAND_DATA is set before setting up logger
	err := CheckEnvVar()
	if err != nil {
		logger.Fatal().Msg(fmt.Sprintf("%s",err))
	}

	// Create handler options and create logger

	// Run prerequisites
	err = Prerequisites(algodInfo)
	if err != nil {
		logger.Fatal().Msg(fmt.Sprintf("%s",err))
	}

	lito := &LitoApp{
		algodInfo: algodInfo,
		Logger: &logger,
		db: database.New(),
	}	
		
	logger.Info().Msg(fmt.Sprint(lito.db.Health()))
	return lito
}

func (l *LitoApp) Run() error {
	// Ensure database connection is closed when app exits
	defer l.db.Close()
	l.Logger.Info().Msg("Starting Lito")


	return nil
}
