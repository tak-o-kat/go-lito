package database

import (
	"database/sql"
	"fmt"
)

type VotesJson struct {
	Count    int             `json:"count"`
	RootType string          `json:"rootType"`
	Votes    *[]roundColumns `json:"votes"`
}

type roundColumns struct {
	Id        int    `json:"id"`
	Round     uint64 `json:"round"`
	TimeStamp string `json:"timestamp"`
	TypeName  string `json:"typeName"`
	TypeId    int    `json:"typeId"`
}

func (s *service) GetVoteById(id int) *roundColumns {
	row := s.db.QueryRow(`
		SELECT v.id, v.round, v.timestamp, v.typeId, t.typeName 
		FROM votes as v 
		INNER JOIN types as t 
		ON v.typeId = t.id 
		WHERE v.id = ?`, id)

	var record = new(roundColumns)

	err := row.Scan(&record.Id, &record.Round, &record.TimeStamp, &record.TypeId, &record.TypeName)
	if err != nil {
		logger.Error().Msgf("Error scanning: %v", err)
	}

	return record
}

func (s *service) GetOrderedVotes(numRows int, order string) *VotesJson {
	// Define query types
	columns := `v.id, v.round, v.timestamp, v.typeId, t.typeName`
	inner := `INNER JOIN types as t ON v.typeId = t.id`
	query := fmt.Sprintf(`SELECT %s FROM votes as v %s ORDER BY v.id %s LIMIT ?`, columns, inner, order)

	// Execute query
	rows, err := s.db.Query(query, numRows)
	if err != nil {
		logger.Error().Msgf("Error preparing: %v", err)
	}

	return generateVotesJson(rows)
}

func (s *service) GetOrderedVotesByType(numRows int, order string, typeId int) *VotesJson {
	// Define query types
	columns := `v.id, v.round, v.timestamp, v.typeId, t.typeName`
	inner := fmt.Sprintf(`INNER JOIN types as t ON v.typeId = t.id WHERE t.id = %d`, typeId)
	query := fmt.Sprintf(`SELECT %s FROM votes as v %s ORDER BY v.id %s LIMIT ?`, columns, inner, order)

	// Execute query
	rows, err := s.db.Query(query, numRows)
	if err != nil {
		logger.Error().Msgf("Error preparing: %v", err)
	}

	return generateVotesJson(rows)
}

func (s *service) GetVotesByDateRange(from string, to string) *VotesJson {
	query := `
		SELECT v.id, v.round, v.timestamp, v.typeId, t.typeName
		FROM votes as v
		INNER JOIN types as t
		ON v.typeId = t.id
		WHERE v.timestamp BETWEEN ? AND ?
	`
	// Execute query
	rows, err := s.db.Query(query, from, to)
	if err != nil {
		logger.Error().Msgf("Error preparing: %v", err)
	}

	// genetrate json and return
	return generateVotesJson(rows)
}

func generateVotesJson(rows *sql.Rows) *VotesJson {
	var row = new(roundColumns)
	votes := new([]roundColumns)

	defer rows.Close()
	for rows.Next() {
		err := rows.Scan(
			&row.Id,
			&row.Round,
			&row.TimeStamp,
			&row.TypeId,
			&row.TypeName)
		if err != nil {
			logger.Error().Msgf("Error scanning: %v", err)
		}
		// Add to votes to slice
		*votes = append(*votes, roundColumns{
			Id:        row.Id,
			Round:     row.Round,
			TimeStamp: row.TimeStamp,
			TypeId:    row.TypeId,
			TypeName:  row.TypeName,
		})
	}

	// Create json and return
	var json = new(VotesJson)
	json.Count = len(*votes)
	json.RootType = "votes"
	json.Votes = votes

	return json
}
