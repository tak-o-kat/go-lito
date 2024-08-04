package database

import (
	"go-lito/internal/parser"
	"strconv"
)

type totalsColumns struct {
	id        int
	count     int
	typeId    int
	createdAt string
	updatedAt string
}

type tMaps map[string]string

func (s *service) GetTotalFor(typeId int) tMaps {
	row := s.db.QueryRow(`
		SELECT * 
		FROM totals 
		WHERE typeId = ?`, typeId)

	var record = new(totalsColumns)
	total := make(map[string]string)

	err := row.Scan(&record.id, &record.count, &record.typeId, &record.createdAt, &record.updatedAt)
	if err != nil {
		logger.Error().Msgf("Error scanning: %v", err)
	}

	// Covert struct to map
	total["id"] = strconv.Itoa(record.id)
	total["count"] = strconv.Itoa(record.count)
	total["typeId"] = strconv.Itoa(record.typeId)
	total["createdAt"] = string(record.createdAt)
	total["updatedAt"] = string(record.updatedAt)

	return total
}

func (s *service) GetAllTotals() *map[string]tMaps {
	rows, err := s.db.Query(`SELECT * FROM totals`)
	if err != nil {
		logger.Error().Msgf("Error preparing: %v", err)
	}

	var row = new(totalsColumns)
	var t = make(map[string]tMaps)

	defer rows.Close()
	for rows.Next() {
		err := rows.Scan(&row.id,
			&row.count,
			&row.typeId,
			&row.createdAt,
			&row.updatedAt)
		if err != nil {
			logger.Error().Msgf("Error scanning: %v", err)
		}

		total := make(tMaps)
		// Covert struct to map
		total["id"] = strconv.Itoa(row.id)
		total["count"] = strconv.Itoa(row.count)
		total["typeId"] = strconv.Itoa(row.typeId)
		total["createdAt"] = string(row.createdAt)
		total["updatedAt"] = string(row.updatedAt)

		switch row.typeId {
		case typeId.soft:
			t["soft"] = total
		case typeId.cert:
			t["cert"] = total
		case typeId.onChain:
			t["onChain"] = total
		case typeId.proposed:
			t["proposed"] = total
		}
	}

	if err = rows.Err(); err != nil {
		logger.Error().Msgf("Error iterating: %v", err)
	}

	return &t
}

func (s *service) GetVotes(numRows int) *[]parser.Votes {

	rows, err := s.db.Query(`SELECT * FROM votes LIMIT ?`, numRows)
	if err != nil {
		logger.Error().Msgf("Error preparing: %v", err)
	}

	type rowColumns struct {
		id        int
		round     uint64
		timeStamp string
		typeId    int64
		createdAt string
	}

	var row = new(rowColumns)
	votes := new([]parser.Votes)

	defer rows.Close()
	for rows.Next() {
		err := rows.Scan(&row.id,
			&row.round,
			&row.timeStamp,
			&row.typeId,
			&row.createdAt)
		if err != nil {
			logger.Error().Msgf("Error scanning: %v", err)
		}
		// Add to votes to slice
		*votes = append(*votes, parser.Votes{
			Round:     row.round,
			TimeStamp: row.timeStamp,
			Type:      row.typeId,
		})
	}

	return votes
}

func (s *service) GetProposals(numRows int) *[]parser.Blocks {

	rows, err := s.db.Query(`SELECT * FROM proposed LIMIT ?`, numRows)
	if err != nil {
		logger.Error().Msgf("Error preparing: %v", err)
	}

	type rowColumns struct {
		id        int
		round     uint64
		timeStamp string
		typeId    int64
		onChain   bool
		blockTime float64
		createdAt string
	}

	var row = new(rowColumns)
	proposals := new([]parser.Blocks)

	defer rows.Close()
	for rows.Next() {
		err := rows.Scan(&row.id,
			&row.round,
			&row.timeStamp,
			&row.typeId,
			&row.onChain,
			&row.blockTime,
			&row.createdAt)
		if err != nil {
			logger.Error().Msgf("Error scanning: %v", err)
		}
		// Add to proposals to slice
		*proposals = append(*proposals, parser.Blocks{
			Round:     row.round,
			TimeStamp: row.timeStamp,
			TypeId:    row.typeId,
			IsOnChain: row.onChain,
			BlockTime: row.blockTime,
		})
	}

	return proposals
}
