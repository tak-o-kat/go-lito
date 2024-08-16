package tests

import (
	"fmt"
	"go-lito/cmd/lito"
	"go-lito/internal/misc"
	"go-lito/internal/parser"
	"os"
	"path/filepath"
	"testing"

	"github.com/stretchr/testify/assert"
)

var Path2 = lito.GetLitoPath()

var CFG2 = lito.Config{
	EnvVar:   "ALGORAND_DATA",
	LitoPath: filepath.Join(Path2, "test"),
	Database: "test.db",
	LogFile:  "archives.log",
	Output:   "test.log",
	Loglevel: "DEBUG",
	Account:  "",
	Port:     "8081",
}

func TestParser(t *testing.T) {
	fmt.Println(CFG2.LitoPath)
	// Get a new zerolog logger
	logger := misc.NewLogger(CFG2.LitoPath, CFG2.LogFile)
	defer os.Remove(filepath.Join(CFG2.LitoPath, CFG2.LogFile))
	var la lito.LitoApp

	la.Logger = logger

	t.Run("Get AlgodInfo", func(t *testing.T) {
		la.AlgodInfo = lito.NewAlgodInfo(la.Logger, &CFG2)
		assert.NotEmpty(t, la.AlgodInfo)

		// if the following errors then it means we didn't set
		// the env variable for testing purposes
		account := os.Getenv("ACCOUNT")
		assert.NotEqual(t, account, "")

		la.AlgodInfo.PartAccount = account
	})

	// Use a known archive.log file for testing any old log file will do
	// just make sure to always use the same one for testing purposes
	t.Run("Test Parser", func(t *testing.T) {
		data := parser.Parser(logger, la.AlgodInfo.ArchiveFile, la.AlgodInfo.PartAccount)

		assert.NotNil(t, data)
		assert.Equal(t, 1, (*data.Totals).BlocksOnChain)
		assert.Equal(t, 9, (*data.Totals).BlocksProposed)
		assert.Equal(t, 596, (*data.Totals).SoftVotes)
		assert.Equal(t, 301, (*data.Totals).CertVotes)
		assert.Equal(t, 9, len(*data.Proposed))
		assert.Equal(t, 897, len(*data.Votes))
	})
}
