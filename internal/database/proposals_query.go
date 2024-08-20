package database

import (
	"database/sql"
	"fmt"
)

type ProposalsJson struct {
	Count         int                 `json:"count"`
	RootType      string              `json:"rootType"`
	hasCurrentLog bool                `json:"hasCurrentLog"`
	Proposals     *[]ProposalsColumns `json:"proposals"`
}

type ProposalsColumns struct {
	Id        int     `json:"id"`
	Round     uint64  `json:"round"`
	TimeStamp string  `json:"timestamp"`
	TypeName  string  `json:"typeName"`
	TypeId    int     `json:"typeId"`
	BlockTime float64 `json:"blockTime"`
}

func (s *service) GetProposalById(id int) (*ProposalsColumns, error) {
	row := s.db.QueryRow(`
		SELECT p.id, p.round, p.timestamp, p.blockTime, p.typeId, t.typeName
		FROM proposed as p
		INNER JOIN types as t 
		ON p.typeId = t.id 
		WHERE p.id = ?`, id)

	var record = new(ProposalsColumns)

	err := row.Scan(&record.Id, &record.Round, &record.TimeStamp, &record.TypeId, &record.TypeName)
	if err != nil {
		logger.Error().Msgf("Error scanning: %v", err)
		return nil, fmt.Errorf("no vote found with id %d", id)
	}

	return record, nil
}

func (s *service) GetSortedProposals(numRows int, order string) *ProposalsJson {
	// Define query types
	columns := `p.id, p.round, p.timestamp, p.blockTime, p.typeId, t.typeName`
	inner := `INNER JOIN types as t ON p.typeId = t.id`
	query := fmt.Sprintf(`SELECT %s FROM proposed as p %s ORDER BY p.id %s LIMIT ?`, columns, inner, order)

	// Execute query
	rows, err := s.db.Query(query, numRows)
	if err != nil {
		logger.Error().Msgf("Error preparing: %v", err)
	}

	return generateProposalsJson(rows)
}

func (s *service) GetSortedProposalsByType(numRows int, order string, typeId int) *ProposalsJson {
	// Define query types
	columns := `p.id, p.round, p.timestamp, p.blockTime, p.typeId, t.typeName`
	inner := fmt.Sprintf(`INNER JOIN types as t ON p.typeId = t.id WHERE t.id = %d`, typeId)
	query := fmt.Sprintf(`SELECT %s FROM proposed as p %s ORDER BY p.id %s LIMIT ?`, columns, inner, order)

	// Execute query
	rows, err := s.db.Query(query, numRows)
	if err != nil {
		logger.Error().Msgf("Error preparing: %v", err)
	}

	return generateProposalsJson(rows)
}

func (s *service) GetProposalsByDateRange(from string, to string) *ProposalsJson {
	query := `
		SELECT p.id, p.round, p.timestamp, p.blockTime, p.typeId, t.typeName
		FROM proposed as p
		INNER JOIN types as t
		ON p.typeId = t.id
		WHERE p.timestamp BETWEEN ? AND ?
	`
	// Execute query
	rows, err := s.db.Query(query, from, to)
	if err != nil {
		logger.Error().Msgf("Error preparing: %v", err)
	}

	// genetrate json and return
	return generateProposalsJson(rows)
}

func generateProposalsJson(rows *sql.Rows) *ProposalsJson {
	var row = new(ProposalsColumns)
	proposals := make([]ProposalsColumns, 0)

	defer rows.Close()
	for rows.Next() {
		err := rows.Scan(
			&row.Id,
			&row.Round,
			&row.TimeStamp,
			&row.BlockTime,
			&row.TypeId,
			&row.TypeName,
		)
		if err != nil {
			logger.Error().Msgf("Error scanning: %v", err)
		}
		// Add to votes to slice
		proposals = append(proposals, ProposalsColumns{
			Id:        row.Id,
			Round:     row.Round,
			TimeStamp: row.TimeStamp,
			TypeId:    row.TypeId,
			TypeName:  row.TypeName,
			BlockTime: row.BlockTime,
		})
	}

	// Create json and return
	var json = new(ProposalsJson)
	json.Count = len(proposals)
	json.RootType = "proposals"
	json.hasCurrentLog = false
	json.Proposals = &proposals

	return json
}
