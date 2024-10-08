package tests

import (
	"go-lito/cmd/lito"
	"go-lito/internal/database"
	"go-lito/internal/misc"
	"go-lito/internal/parser"
	"os"
	"path/filepath"
	"testing"

	"github.com/stretchr/testify/assert"
)

var Path3 = lito.GetLitoPath()

var CFG3 = lito.Config{
	EnvVar:   "ALGORAND_DATA",
	LitoPath: filepath.Join(Path3, "test"),
	Database: "test.db",
	LogFile:  "archives.log",
	Output:   "test.log",
	Loglevel: "DEBUG",
	Account:  "",
	Port:     "8081",
}

func TestInserterTotals(t *testing.T) {
	logger := misc.NewLogger(CFG3.LitoPath, CFG3.Output)

	// get database instance and create tables
	file := filepath.Join(CFG3.LitoPath, CFG3.Database)
	_ = file

	err := os.MkdirAll(CFG3.LitoPath, 0664)
	if err != nil {
		t.Errorf("%s", err)
	}

	db := database.New(logger, CFG3.LitoPath, CFG3.Database)
	db.CreateTables()

	expected := true
	got := db.CheckDefaultTables()
	if expected != got {
		t.Errorf("expected %v; got %v", expected, got)
	}

	// delete db
	defer db.Close()
	defer os.Remove(file)
	defer os.Remove(filepath.Join(CFG3.LitoPath, CFG3.LogFile))

	t.Run("Test Insert Totals", func(t *testing.T) {
		// Get node data
		totals := new(parser.Totals)
		totals.BlocksOnChain = 2
		totals.BlocksProposed = 13
		totals.CertVotes = 387
		totals.SoftVotes = 687

		// Insert node data into database
		err := db.InsertTotals(totals)
		assert.NoError(t, err)

		jsonResp := db.GetAllTotals()

		// Convert map to struct
		dbTotals := new(parser.Totals)
		dbTotals.SoftVotes = jsonResp.Soft.Count
		dbTotals.CertVotes = jsonResp.Cert.Count
		dbTotals.BlocksOnChain = jsonResp.OnChain.Count
		dbTotals.BlocksProposed = jsonResp.Proposed.Count

		assert.Equal(t, *totals, *dbTotals)
	})

	t.Run("Test Insert Votes", func(t *testing.T) {

		votes := getMockVotes()

		err := db.InsertVotes(votes)
		assert.NoError(t, err)

		jsonVotes := db.GetSortedVotes(len(*votes), "ASC")
		var dbVotes = new([]parser.Votes)
		for _, v := range *jsonVotes.Votes {
			var vote = new(parser.Votes)
			vote.Round = v.Round
			vote.TimeStamp = v.TimeStamp
			vote.Type = int64(v.TypeId)
			*dbVotes = append(*dbVotes, *vote)
		}

		assert.Equal(t, *votes, *dbVotes)
	})

	t.Run("Test Insert Proposals", func(t *testing.T) {

		proposals := getMockProposals()

		err := db.InsertProposals(proposals)
		assert.NoError(t, err)

		dbProposals := db.GetProposals(len(*proposals))

		assert.Equal(t, *proposals, *dbProposals)
	})
}

func getMockVotes() *[]parser.Votes {
	votes := new([]parser.Votes)
	votes = &[]parser.Votes{
		{
			Round:     2481766,
			TimeStamp: "2024-07-27T17:31:45.816675-07:00",
			Type:      1,
		},
		{
			Round:     2457651,
			TimeStamp: "2024-07-27T19:44:44.591018-07:00",
			Type:      2,
		},
		{
			Round:     2424465,
			TimeStamp: "2024-07-27T16:53:38.073434-07:00",
			Type:      2,
		},
		{
			Round:     2487006,
			TimeStamp: "2024-07-27T13:55:09.222409-07:00",
			Type:      2,
		},
		{
			Round:     2454329,
			TimeStamp: "2024-07-27T09:28:39.134837-07:00",
			Type:      1,
		},
		{
			Round:     2401004,
			TimeStamp: "2024-07-28T02:03:01.971322-07:00",
			Type:      1,
		},
		{
			Round:     2473691,
			TimeStamp: "2024-07-27T15:31:27.157012-07:00",
			Type:      2,
		},
		{
			Round:     2444607,
			TimeStamp: "2024-07-27T15:38:53.390045-07:00",
			Type:      2,
		},
		{
			Round:     2409687,
			TimeStamp: "2024-07-28T03:08:26.367853-07:00",
			Type:      1,
		},
		{
			Round:     2492179,
			TimeStamp: "2024-07-28T03:08:26.367853-07:00",
			Type:      1,
		},
	}
	return votes
}

func getMockProposals() *[]parser.Blocks {
	proposals := new([]parser.Blocks)
	proposals = &[]parser.Blocks{
		{
			Round:     2481766,
			TimeStamp: "2024-07-27T17:31:45.816675-07:00",
			IsOnChain: true,
			TypeId:    4,
			BlockTime: 2.8475,
		},
		{
			Round:     2457651,
			TimeStamp: "2024-07-27T19:44:44.591018-07:00",
			IsOnChain: false,
			TypeId:    3,
			BlockTime: 2.8891,
		},
		{
			Round:     2424465,
			TimeStamp: "2024-07-27T16:53:38.073434-07:00",
			IsOnChain: false,
			TypeId:    3,
			BlockTime: 2.9645,
		},
		{
			Round:     2487006,
			TimeStamp: "2024-07-27T13:55:09.222409-07:00",
			IsOnChain: false,
			TypeId:    3,
			BlockTime: 2.8942,
		},
		{
			Round:     2454329,
			TimeStamp: "2024-07-27T09:28:39.134837-07:00",
			IsOnChain: false,
			TypeId:    3,
			BlockTime: 2.8447,
		},
		{
			Round:     2401004,
			TimeStamp: "2024-07-28T02:03:01.971322-07:00",
			IsOnChain: true,
			TypeId:    4,
			BlockTime: 2.8186,
		},
		{
			Round:     2473691,
			TimeStamp: "2024-07-27T15:31:27.157012-07:00",
			IsOnChain: false,
			TypeId:    3,
			BlockTime: 2.9075,
		},
		{
			Round:     2444607,
			TimeStamp: "2024-07-27T15:38:53.390045-07:00",
			IsOnChain: false,
			TypeId:    3,
			BlockTime: 2.8306,
		},
		{
			Round:     2409687,
			TimeStamp: "2024-07-28T03:08:26.367853-07:00",
			IsOnChain: false,
			TypeId:    3,
			BlockTime: 2.7932,
		},
		{
			Round:     2492179,
			TimeStamp: "2024-07-28T03:08:49.367853-07:00",
			IsOnChain: false,
			TypeId:    3,
			BlockTime: 2.8888,
		},
	}
	return proposals
}
