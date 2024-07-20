package lito

import (
	"fmt"
	"log/slog"
	"os"

	_ "github.com/joho/godotenv/autoload"

	"go-lito/internal/database"
)

type AlgodInfo struct {
	url string
	token string
}

type LitoApp struct {
	algodInfo *AlgodInfo
	Logger *slog.Logger
	db database.Service
}


func Init() *LitoApp {
	algodInfo := &AlgodInfo{
		url: "",
		token: "",
	}
	var logger *slog.Logger

	// Check to see it ALGORAND_DATA is set before settin gup logger
	err := CheckEnvVar()
	if err != nil {
		slog.Error(fmt.Sprintf("%s",err))
		os.Exit(1)
	}

	// Set up logger
	handlerOpts := &slog.HandlerOptions{
		Level: slog.LevelDebug,
		AddSource: true,
	}
	logger = slog.New(slog.NewJSONHandler(os.Stderr, handlerOpts))
	slog.SetDefault(logger)

	// Run prerequisites
	err = Prerequisites(algodInfo)
	if err != nil {
		slog.Error(fmt.Sprintf("%s",err))
		os.Exit(1)
	}

	lito := &LitoApp{
		algodInfo: algodInfo,
		Logger: logger,
		db: database.New(),
	}	
	
	logger.Debug("init complete")
	return lito
}

func (l *LitoApp) Run() error {
	// Ensure database connection is closed 
	defer l.db.Close()

	l.Logger.Info(l.algodInfo.url)
	l.Logger.Info(l.algodInfo.token)

	return nil
}
