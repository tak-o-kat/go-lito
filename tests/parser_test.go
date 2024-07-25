package tests

import (
	"os"
	"testing"

	"go-lito/cmd/lito"
	"go-lito/internal/database"

	"github.com/stretchr/testify/assert"
)

func TestParser(t *testing.T) {
	var la lito.LitoApp
	t.Run("Get Logger", func(t *testing.T) {
		la.Logger = lito.NewLogger()
		assert.NotNil(t, la.Logger)
	})
	
	t.Run("Get AlgodInfo", func(t *testing.T) {
		la.AlgodInfo = lito.NewAlgodInfo(la.Logger, "node.test.log")
		assert.NotEmpty(t, la.AlgodInfo)
	})

	t.Run("Get DB Instance", func(t *testing.T) {
		path := os.Getenv("ALGORAND_DATA")
		path += "/lito"

		err := os.MkdirAll(path, os.ModePerm)
		if err != nil {
			t.Errorf("%s",err)
		}

		// os.OpenFile(path + "/test.db", os.O_CREATE/os.O_RDWR, 0777)
		la.DB = database.New(la.Logger, "/test/test.db")
		database.CreateTables(la.Logger)

		assert.NotNil(t, la.DB)
		assert.FileExists(t, path + "/test/test.db")
	})

	// Use a known archive.log file for testing any old log file will do
	// just make sure to always use the same one for testing purposes
	t.Run("Test Parser", func(t *testing.T) {
		data := lito.Parser(&la)

		assert.NotNil(t, data)
		assert.Equal(t, 1, (*data.Totals).BlocksOnChain)
		assert.Equal(t, 9, (*data.Totals).BlocksProposed)
		assert.Equal(t, 596, (*data.Totals).SoftVotes)
		assert.Equal(t, 301, (*data.Totals).CertVotes)

	})


}