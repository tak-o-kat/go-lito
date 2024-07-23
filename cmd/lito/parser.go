package lito

import (
	//"runtime"
	"bufio"
	"encoding/json"
	"fmt"
	"os"
	"sort"
	"strconv"
	"strings"
	"time"
)

type Totals struct {
	blocksOnChain int
	blocksProposed int
	softVotes int
	certVotes int
}

type Blocks struct {
	Round uint64 `json:"round"`
	TimeStamp string `json:"time"`
	Sender string `json:"sender"`
	isOnChain bool 
	startTime time.Time
	endTime time.Time
}

type Votes struct {
	Round uint64 `json:"round"`
	TimeStamp string `json:"time"`
	Type int64 `json:"ObjectStep"`
}

type LogData struct {
	totals Totals
	Blocks map[uint64]Blocks
	votes []Votes
	round uint64
	startTime time.Time
	sender string
}


func Parse(la *LitoApp) {
	address := la.algodInfo.partAccount
	la.Logger.Debug().Msg("Address: " + address)

	// Open log file
	logFile := os.Getenv("ALGORAND_DATA") + "/archive.log" // use 
	file , ferr := os.Open (logFile)
	if ferr != nil {
			panic(ferr)
	}

	var parsedData = LogData{
		totals: Totals{},
		Blocks: make(map[uint64]Blocks),
		votes: []Votes{},
		round: 0,
		startTime: time.Now(),
		sender: address,
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

	// Print out data for testing
	fmt.Println(parsedData.totals)

	blockArr := blockSorter(parsedData.Blocks)
	for _, block := range blockArr {
		fmt.Println(block)
	}

	bl := parsedData.Blocks[40557166]
	blockTime := durationToSeconds(bl.endTime, bl.startTime)

	fmt.Printf("Block Time for Round 40557166: %s\n", bl.endTime.Sub(bl.startTime).String())
	fmt.Printf("Block Time for Round 40557166: %0.2f\n", blockTime)
}

// Helper function to convert duration to seconds
func durationToSeconds(et time.Time, st time.Time) float64 {
	blockTimeStr := strings.Split(et.Sub(st).String(), "s")[0]
	blockTime, err := strconv.ParseFloat(blockTimeStr, 64)

	if err != nil {
		panic(err)
	}
	return blockTime
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
	// extract json log data from line
	parsedJson := Blocks{}
	jsonErr := json.Unmarshal([]byte(*line), &parsedJson)
	if jsonErr != nil {
		panic(jsonErr)
	}

	// Add to the map
	ld.Blocks[parsedJson.Round] = parsedJson

	// Save this round in order to extrac block time end time in RoundConcluded
	ld.round = uint64(parsedJson.Round)

	// increment total
	ld.totals.blocksProposed++
}

func RoundConcludedParser(line *string, ld *LogData) {
	// Check see if this round is in the block map
	if _, ok := ld.Blocks[ld.round]; ok {
		parsedJson := Blocks{}
		jsonErr := json.Unmarshal([]byte(*line), &parsedJson)
		if jsonErr != nil {
			panic(jsonErr)
		}

		// Find block and update isOnChain
		block := ld.Blocks[parsedJson.Round]
		block.startTime = ld.startTime
		block.endTime, _ = time.Parse(time.RFC3339Nano, parsedJson.TimeStamp)

		// Check and see if the sender is our account, if so set isOnChain to true
		if parsedJson.Sender == ld.sender {
			block.isOnChain = true
			ld.totals.blocksOnChain++
		}
		ld.Blocks[parsedJson.Round] = block
	}
}

func SoftVotesParser(line *string, ld *LogData) {
	parsedJson := Votes{}
	jsonErr := json.Unmarshal([]byte(*line), &parsedJson)
	if jsonErr != nil {
		panic(jsonErr)
	}

	ld.votes = append(ld.votes, parsedJson)
	ld.totals.softVotes++
}

func CertVotesParser(line *string, ld *LogData) {
	parsedJson := Votes{}
	jsonErr := json.Unmarshal([]byte(*line), &parsedJson)
	if jsonErr != nil {
		panic(jsonErr)
	}

	ld.votes = append(ld.votes, parsedJson)
	ld.totals.certVotes++
}

// Helper to sort the blocks map
func blockSorter(b map[uint64]Blocks) []Blocks {
	keys := make([]string, 0, len(b))
	for k := range b {
		keys = append(keys, fmt.Sprintf("%d", k))
	}

	sort.Strings(keys)
	blocks := []Blocks{}

	for _, k := range keys {
		round, err := strconv.ParseUint(k, 10, 64)
		if err != nil {
			panic(err)
		}
		blocks = append(blocks, b[round])
	}
	return blocks
}