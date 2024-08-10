package main

import (
	"fmt"
	"go-lito/cmd/lito"
	"go-lito/internal/misc"
	"go-lito/internal/server"
	"log/slog"

	_ "github.com/joho/godotenv/autoload"
)

func runDaemon() {

}

func runServer() {

}

func main() {
	// Get a new zerolog logger
	logger := misc.NewLogger()
	misc.LoadEnvSettings(logger)

	// Use channel to inform the http server to continue running
	dbCreated := make(chan bool)

	go func() {
		lito := lito.Init(dbCreated, logger)

		err := lito.Run()
		if err != nil {
			slog.Error(fmt.Sprintf("%s", err))
		}
	}()

	// Wait for the database to be created
	runApiServer := <-dbCreated

	logger.Debug().Msgf("Starting http server: %v", runApiServer)

	// Used to start the http server **
	if runApiServer {
		server := server.NewServer(logger)

		err := server.ListenAndServe()
		if err != nil {
			panic(fmt.Sprintf("cannot start server: %s", err))
		}
	}

}
