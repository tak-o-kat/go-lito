package tests

import (
	"go-lito/cmd/lito"
	"go-lito/internal/misc"
	"go-lito/internal/parser"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestParser(t *testing.T) {
		// Get a new zerolog logger
	logger := misc.NewLogger()

	var la lito.LitoApp

	la.Logger = logger

	t.Run("Get AlgodInfo", func(t *testing.T) {
		la.AlgodInfo = lito.NewAlgodInfo(la.Logger, "node.test.log")
		assert.NotEmpty(t, la.AlgodInfo)
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

	// os.Remove(filepath.Join(path, file))
}