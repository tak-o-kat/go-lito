package lito

import (
	"bufio"
	"encoding/json"
	"fmt"
	"os"
	"strings"
)

type Counters struct {
	blocksOnChain int
	blocksProposed int
	softVotes int
	certVotes int
}

type Block struct {
	block string
	isOnChain bool
	dateTime string	
}

func Parse(la *LitoApp) {
	address := la.algodInfo.partAccount // CTTR2JYLHQVQRTLAMNUA475YSBBOPSUOG5E72AOR6MQYRNFVJX4Q5YZUMY
	logFile := la.algodInfo.archiveFile
	file , ferr := os.Open (logFile)
	if ferr != nil {
			panic(ferr)
	}

	counters := Counters{
		blocksOnChain: 0,
		blocksProposed: 0,
		softVotes: 0,
		certVotes: 0,
	}
	blocks := make(map[string]Block)
	sender := `"Sender":` + `"` + address + `"`

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		line := scanner.Text()

		if (strings.Contains(line, "ProposalBroadcast")) {
			var data map[string]interface{}
			json.Unmarshal([]byte(line), &data)
			
			
			// get round and date time
			var round = fmt.Sprintf("%.0f", data["Round"])
			var dateTime = fmt.Sprintf("%s", data["time"])

			// Add to the map
			blocks[round] = Block{block: round, isOnChain: false, dateTime: dateTime}
			
			// increment
			counters.blocksProposed++
			continue
		}

		if (strings.Contains(line, "RoundConcluded") && strings.Contains(line, sender)) {
			var data map[string]interface{}
			json.Unmarshal([]byte(line), &data)
			var round = fmt.Sprintf("%.0f", data["Round"])
			fmt.Println(round)
			
			// Find block and update isOnChain
			block := blocks[round]
			block.isOnChain = true
			blocks[round] = block

			// increment
			counters.blocksOnChain++
			continue
		}

		// Search for Soft and Cert votes
		if (strings.Contains(line, "VoteBroadcast") && strings.Contains(line, "\"ObjectStep\":1")) {
			counters.softVotes++
			continue
		}
		
		if (strings.Contains(line, "VoteBroadcast") && strings.Contains(line, "\"ObjectStep\":2")) {
			counters.certVotes++
			continue
		}
	}
	
	file.Close()

	// Print results
	fmt.Println(counters)
	for _, e := range blocks {
		fmt.Println(e)
	}
}