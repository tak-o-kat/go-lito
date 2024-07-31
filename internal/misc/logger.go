package misc

import (
	"fmt"
	"os"
	"time"

	"github.com/rs/zerolog"
)


func NewLogger() *zerolog.Logger {
	var level = zerolog.InfoLevel

	switch os.Getenv("APP_ENV") {
	case "trace":
		level = zerolog.TraceLevel
	case "debug":
		level = zerolog.DebugLevel
	default:
		level = zerolog.InfoLevel
	}

	// Create a nice looking output to stderr
	output := zerolog.ConsoleWriter{Out: os.Stderr, TimeFormat: time.RFC3339}
	output.FormatMessage = func(i interface{}) string {
		return fmt.Sprintf("%s", i)
	}

	logger := zerolog.New(output).
		With().
		Caller().
		Int("pid", os.Getpid()).
		Timestamp().
		Logger().Level(level)
	return &logger
}