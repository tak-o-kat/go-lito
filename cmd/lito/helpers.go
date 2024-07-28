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

func NewAlgodInfo(l *zerolog.Logger, file string) *AlgodInfo {
	archiveLog := os.Getenv("LOG_FILE")
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
		ArchivePath: archivePath,
		ArchiveFile: archiveFile,
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

func GetLitoPath() string {
	path := os.Getenv("ALGORAND_DATA")
	path += "/lito/"

	return path
}
