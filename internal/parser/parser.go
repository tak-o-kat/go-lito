package parser

import (
	//"runtime"
	"bufio"
	"fmt"
	"os"
	"strings"
	"time"

	"github.com/rs/zerolog"
)

type Totals struct {
	BlocksOnChain int
	BlocksProposed int
	SoftVotes int
	CertVotes int
}

type Blocks struct {
	Round uint64 `json:"round"`
	TimeStamp string `json:"time"`
	Sender string `json:"sender"`
	isOnChain bool 
	startTime time.Time
	endTime time.Time
	BlockTime float64
}

type Votes struct {
	Round uint64 `json:"round"`
	TimeStamp string `json:"time"`
	Type int64 `json:"ObjectStep"`
}

type LogData struct {
	totals *Totals
	Blocks *map[uint64]Blocks
	orderedRounds *[]uint64
	votes *[]Votes
	round uint64
	startTime time.Time
	sender string
}

type SortedData struct {
	Totals *Totals
	Proposed *[]Blocks
	Votes *[]Votes
}


func Parser(l *zerolog.Logger, logFile string, account string) *SortedData {
	l.Debug().Msg("Parsing: " + logFile)
	
	// Log file to parse. *** TODO: Need to swap out for l.AlgodInfo.archiveFile
	file , ferr := os.Open (logFile)
	if ferr != nil {
			panic(ferr)
	}

	blockMap := make(map[uint64]Blocks)

	var parsedData = LogData{
		totals: new(Totals),
		Blocks: &blockMap,
		orderedRounds: new([]uint64),
		votes: new([]Votes),
		round: 0,
		startTime: time.Now(),
		sender: account,
	}

	// Open log file and read line by line to exract node data
	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		line := scanner.Text()

		// Get the start time of each round and if save it in case we propose a block 
		// we can get the end time in the RoundConcluded step and calculate the block time
		if (strings.Contains(line, "ProposalAssembled")) {
			parsedData.startTime = ProposalAssembledParser(&line)
			continue
		}

				// Check and see if the a vote we broadcasted is a soft vote
		if strings.Contains(line, "VoteBroadcast") && strings.Contains(line, "\"ObjectStep\":1") {
			SoftVotesParser(&line, &parsedData)
			continue
		}

		// Check and see if the a vote we broadcasted is a cert vote
		if strings.Contains(line, "VoteBroadcast") && strings.Contains(line, "\"ObjectStep\":2") {
			CertVotesParser(&line, &parsedData)
			continue
		}

		// Check if we have any blocks we have proposed
		if (strings.Contains(line, "ProposalBroadcast")) {
			ProposalBroadcastParser(&line, &parsedData)
			continue
		}

		// Check if the RoundConcluded is any blocks we have proposed from the ProposalBroadcast step 
		// and get the block time and if our node proposed that block on chain
		if strings.Contains(line, "RoundConcluded")  && strings.Contains(line, fmt.Sprintf("%d", parsedData.round)) {
			RoundConcludedParser(&line, &parsedData)
			continue
		}
	}
	
	defer file.Close()

	// Use the Ordered Rounds array to sort the block map
	sortedBlocks := blockSorter(parsedData.orderedRounds, parsedData.Blocks)

	nodeData := new(SortedData) 
	nodeData.Totals = parsedData.totals
	nodeData.Proposed = sortedBlocks
	nodeData.Votes = parsedData.votes

	l.Info().Msg("Finished parsing")

	return nodeData
}