package parser

import (
	"encoding/json"
	"fmt"
	"strconv"
	"strings"
	"time"
)

// Helper function to convert duration to seconds
func durationToSeconds(et time.Time, st time.Time) float64 {
	blockTimeStr := strings.Split(et.Sub(st).String(), "s")[0]
	blockTime, err := strconv.ParseFloat(blockTimeStr, 64)

	if err != nil {
		panic(err)
	}
	return blockTime
}

func convertToUtc(t string) (string, error) {
	// convert string to local RFC3339 format
	parsedLocalDate, err := time.Parse(time.RFC3339Nano, t)
	if err != nil {
		return "", fmt.Errorf("failed to parse local date: %w", err)
	}

	// Convert the parsed date to UTC in RFC3339 format
	utcDate := parsedLocalDate.UTC().Format(time.RFC3339Nano)

	return utcDate, nil
}

func ProposalAssembledParser(line *string) time.Time {
	parsedJson := Blocks{}
	jsonErr := json.Unmarshal([]byte(*line), &parsedJson)
	if jsonErr != nil {
		panic(jsonErr)
	}

	// Save the start time of each round, and save for later if needed
	startTime, err := time.Parse(time.RFC3339Nano, parsedJson.TimeStamp)
	if err != nil {
		panic(err)
	}
	return startTime
}

func ProposalBroadcastParser(line *string, ld *LogData) {
	// Collect all the rounds we have proposed in an array
	// this array will serve as a key sorter for the block map

	// extract json log data from line
	parsedJson := Blocks{}
	jsonErr := json.Unmarshal([]byte(*line), &parsedJson)
	if jsonErr != nil {
		panic(jsonErr)
	}

	var err error
	// Convert time to UTC
	parsedJson.TimeStamp, err = convertToUtc(parsedJson.TimeStamp)
	if err != nil {
		panic(err)
	}

	// Add to the map
	(*ld.Blocks)[parsedJson.Round] = parsedJson

	// Save this round in order to extract block time end time in RoundConcluded
	ld.round = uint64(parsedJson.Round)
	ld.isProposed = true

	// Add Block to Round Slice for sorting later on
	*ld.orderedRounds = append(*ld.orderedRounds, parsedJson.Round)
	// increment total
	ld.totals.BlocksProposed++
}

func RoundConcludedParser(line *string, ld *LogData) {
	// Check to see if this round is in the block map
	if _, ok := (*ld.Blocks)[ld.round]; ok {
		parsedJson := Blocks{}
		jsonErr := json.Unmarshal([]byte(*line), &parsedJson)
		if jsonErr != nil {
			panic(jsonErr)
		}

		// Extract block from block map and add in extra data
		block := (*ld.Blocks)[parsedJson.Round]
		block.startTime = ld.startTime
		block.endTime, _ = time.Parse(time.RFC3339Nano, parsedJson.TimeStamp)

		// Calculate the block time from the timestamps of ProposalAssembled and RoundConcluded
		block.BlockTime = durationToSeconds(block.endTime, block.startTime)

		// Check and see if the sender is our account, if so set isOnChain to true
		if parsedJson.Sender == ld.sender {
			block.IsOnChain = true
			ld.totals.BlocksOnChain++
		}

		ld.isProposed = false

		// Add block to block map
		(*ld.Blocks)[parsedJson.Round] = block
	}
}

func SoftVotesParser(line *string, ld *LogData) {
	parsedJson := new(Votes)
	jsonErr := json.Unmarshal([]byte(*line), &parsedJson)
	if jsonErr != nil {
		panic(jsonErr)
	}

	var err error
	// Convert time to UTC
	parsedJson.TimeStamp, err = convertToUtc(parsedJson.TimeStamp)
	if err != nil {
		panic(err)
	}

	(*ld.votes) = append(*ld.votes, *parsedJson)
	ld.totals.SoftVotes++
}

func CertVotesParser(line *string, ld *LogData) {
	parsedJson := new(Votes)
	jsonErr := json.Unmarshal([]byte(*line), &parsedJson)
	if jsonErr != nil {
		panic(jsonErr)
	}

	var err error
	// Convert time to UTC
	parsedJson.TimeStamp, err = convertToUtc(parsedJson.TimeStamp)
	if err != nil {
		panic(err)
	}

	(*ld.votes) = append(*ld.votes, *parsedJson)
	ld.totals.CertVotes++
}

// Helper to sort the blocks map
func blockSorter(sortedKeys *[]uint64, b *map[uint64]Blocks) *[]Blocks {
	blocks := []Blocks{}
	for _, key := range *sortedKeys {
		blocks = append(blocks, (*b)[key])
	}
	return &blocks
}
