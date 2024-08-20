package database

import (
	"database/sql"
	"fmt"
)

type VotesJson struct {
	Count         int             `json:"count"`
	RootType      string          `json:"rootType"`
	HasCurrentLog bool            `json:"hasCurrentLog"`
	Votes         *[]RoundColumns `json:"votes"`
}

type RoundColumns struct {
	Id        int    `json:"id"`
	Round     uint64 `json:"round"`
	TimeStamp string `json:"timestamp"`
	TypeName  string `json:"typeName"`
	TypeId    int    `json:"typeId"`
}

func (s *service) GetVoteById(id int) (*RoundColumns, error) {
	row := s.db.QueryRow(`
		SELECT v.id, v.round, v.timestamp, v.typeId, t.typeName 
		FROM votes as v 
		INNER JOIN types as t 
		ON v.typeId = t.id 
		WHERE v.id = ?`, id)

	var record = new(RoundColumns)

	err := row.Scan(&record.Id, &record.Round, &record.TimeStamp, &record.TypeId, &record.TypeName)
	if err != nil {
		logger.Error().Msgf("Error scanning: %v", err)
		return new(RoundColumns), fmt.Errorf("no vote found with id %d", id)
	}

	return record, nil
}

func (s *service) GetSortedVotes(numRows int, order string) *VotesJson {
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

func (s *service) GetSortedVotesByType(numRows int, order string, typeId int) *VotesJson {
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
	var row = new(RoundColumns)
	votes := make([]RoundColumns, 0)

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
		votes = append(votes, RoundColumns{
			Id:        row.Id,
			Round:     row.Round,
			TimeStamp: row.TimeStamp,
			TypeId:    row.TypeId,
			TypeName:  row.TypeName,
		})
	}

	// Create json and return
	var json = new(VotesJson)
	json.Count = len(votes)
	json.RootType = "votes"
	json.HasCurrentLog = false
	json.Votes = &votes

	return json
}
