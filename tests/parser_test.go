package tests

import (
	"go-lito/cmd/lito"
	"go-lito/internal/database"
	"go-lito/internal/misc"
	"go-lito/internal/parser"
	"os"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestParser(t *testing.T) {
		// Get a new zerolog logger
	logger := misc.NewLogger()
	var la lito.LitoApp

	la.Logger = logger

	// Path to test.db
	path := os.Getenv("ALGORAND_DATA")
	path += "/lito/test"

	t.Run("Get AlgodInfo", func(t *testing.T) {
		la.AlgodInfo = lito.NewAlgodInfo(la.Logger, "node.test.log")
		assert.NotEmpty(t, la.AlgodInfo)
	})

	t.Run("Get DB Instance", func(t *testing.T) {


		err := os.MkdirAll(path, os.ModePerm)
		if err != nil {
			t.Errorf("%s",err)
		}

		// os.OpenFile(path + "/test.db", os.O_CREATE/os.O_RDWR, 0777)
		la.DB = database.New(la.Logger, "/test/test.db")
		database.CreateTables()

		assert.NotNil(t, la.DB)
		assert.FileExists(t, path + "/test.db")
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
		la.DB.Close()
		os.Remove(path + "/test.db")
	})
}
