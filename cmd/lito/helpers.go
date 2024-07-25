package lito

import (
	"errors"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"time"

	"github.com/rs/zerolog"
)

// Get an instance of a zerolog logger
func NewLogger() *zerolog.Logger {
	var level = zerolog.InfoLevel

	switch os.Getenv("APP_ENV") {
	case "trace":
		level = zerolog.TraceLevel
	case "debug":
		level = zerolog.DebugLevel
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

func NewAlgodInfo(l *zerolog.Logger, file string) *AlgodInfo {
	archiveLog := file
	archivePath := os.Getenv("ALGORAND_DATA")
	archiveFile := filepath.Join(archivePath, archiveLog)

	exists, err := Exists(archiveFile)
	if err != nil {
		l.Error().Msg(fmt.Sprintf("%s",err))
	}

	// Check if archive file exists, if not create one
	if !exists {
		l.Debug().Msg("Creating archive file: " + archiveFile)
		_, err := os.Create(archiveFile)
		if err != nil {
			l.Error().Msg(fmt.Sprintf("%s",err))
		}
	}

	// Set up default AlgodInfo
	algodInfo := &AlgodInfo{
		url: "",
		token: "",
		archivePath: archivePath,
		archiveFile: archiveFile,
		PartAccount: os.Getenv("ACCOUNT"),
	}
	return algodInfo
}

func Exists(name string) (bool, error) {
	_, err := os.Stat(name)
	if err == nil {
			return true, nil
	}
	if errors.Is(err, os.ErrNotExist) {
			return false, nil
	}
	return false, err
}

func GetAccountAddress() (string, error) {
	cmd := "goal account partkeyinfo | " +
			"sed -n '/Parent/p' | " +
			"awk '{print $3}'"
	stdout, err := exec.Command("bash", "-c", cmd).Output()
	_ = stdout
	if err != nil {
		return "", fmt.Errorf("%s", err)
	}
	return strings.TrimSuffix(string(stdout), "\n"), nil
}
