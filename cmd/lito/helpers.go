package lito

import (
	"errors"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"

	"github.com/rs/zerolog"
)

func NewAlgodInfo(l *zerolog.Logger, cfg *Config) *AlgodInfo {
	// The default log file is node.archive.log
	// But we can change this for testing purposes using .env or cli flags
	archiveLog, isSet := os.LookupEnv("LOG_FILE")
	if !isSet || archiveLog == "" {
		archiveLog = cfg.LogFile
	}

	archivePath, isSet := os.LookupEnv(cfg.EnvVar)
	if !isSet {
		l.Fatal().Msgf("%s env variable is not set", cfg.EnvVar)
	}

	// Add the archive log file to the archive path
	archiveFile := filepath.Join(archivePath, archiveLog)

	exists, err := Exists(archiveFile)
	if err != nil {
		l.Error().Msg(fmt.Sprintf("%s", err))
	}

	// Check if archive file exists, if not create one
	if !exists {
		l.Debug().Msg("Creating archive file: " + filepath.Join(archivePath, archiveLog))
		_, err := os.Create(archiveFile)
		if err != nil {
			l.Error().Msg(fmt.Sprintf("%s", err))
		}
	}

	// Set up default AlgodInfo
	algodInfo := &AlgodInfo{
		url:         "",
		token:       "",
		ArchivePath: archivePath,
		ArchiveFile: archiveFile,
		PartAccount: "",
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
	// Get the part account address
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

func GetLitoPath() string {
	path := filepath.Join(os.Getenv("ALGORAND_DATA"), "lito")
	return path
}
