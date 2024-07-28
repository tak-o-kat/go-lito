package database

import (
	"go-lito/internal/parser"
)


func (s *service) GetAllTotals() *parser.Totals {
	rows, err := s.db.Query(`SELECT * FROM totals`)
	if err != nil {
		logger.Error().Msgf("Error preparing: %v", err)
	}

	type rowColumns struct {
		id int
		count int
		typeId int
		createdAt string
		updatedAt string
	}

	var row = new(rowColumns)
	var t = new(parser.Totals)

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

		switch row.typeId {
			case typeId.soft:
				t.SoftVotes = row.count
			case typeId.cert:
				t.CertVotes = row.count
			case typeId.onChain:
				t.BlocksOnChain = row.count
			case typeId.proposed:
				t.BlocksProposed = row.count
		}
	}

	if err = rows.Err(); err != nil {
		logger.Error().Msgf("Error iterating: %v", err)
	}

	return t
}


func (s *service) GetVotes(numRows int) *[]parser.Votes {

	rows, err := s.db.Query(`SELECT * FROM votes LIMIT ?`, numRows)
	if err != nil {
		logger.Error().Msgf("Error preparing: %v", err)
	}

	type rowColumns struct {
		id int
		round uint64
		timeStamp string
		typeId int64
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
			Round: row.round,
			TimeStamp: row.timeStamp,
			Type: row.typeId,
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
		id int
		round uint64
		timeStamp string
		typeId int64
		onChain bool
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
			Round: row.round,
			TimeStamp: row.timeStamp,
			TypeId: row.typeId,
			IsOnChain: row.onChain,
			BlockTime: row.blockTime,
		})
	}

	return proposals
}
