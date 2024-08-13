package misc

import (
	"fmt"
	"io"
	"os"
	"path/filepath"
	"time"

	"github.com/rs/zerolog"
)

func NewLogger(path string, logFile string) *zerolog.Logger {
	var level = zerolog.InfoLevel

	switch os.Getenv("APP_ENV") {
	case "trace":
		level = zerolog.TraceLevel
	case "debug":
		level = zerolog.DebugLevel
	default:
		level = zerolog.InfoLevel
	}

	// Creata the path to the log file
	err := os.MkdirAll(path, 0664)
	if err != nil {
		panic(err)
	}

	// Add the log file to the path
	file := filepath.Join(path, logFile)

	// Open log file and/or create it
	log, err := os.OpenFile(
		file,
		os.O_APPEND|os.O_CREATE|os.O_WRONLY,
		0664,
	)
	if err != nil {
		panic(err)
	}

	// Create a nice looking output to log file and stdout
	cw1 := zerolog.ConsoleWriter{Out: log, TimeFormat: time.RFC3339}
	cw1.FormatMessage = func(i interface{}) string {
		return fmt.Sprintf("%s", i)
	}

	cw2 := zerolog.ConsoleWriter{Out: os.Stdout, TimeFormat: time.RFC3339}
	cw2.FormatMessage = func(i interface{}) string {
		return fmt.Sprintf("%s", i)
	}
	multi := io.MultiWriter(cw1, cw2)

	logger := zerolog.New(multi).
		With().
		Caller().
		Int("pid", os.Getpid()).
		Timestamp().
		Logger().
		Level(level)
	return &logger
}
