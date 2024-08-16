package database

import (
	"go-lito/internal/parser"
)

type TotalsColumns struct {
	Id        int    `json:"id"`
	Count     int    `json:"count"`
	TypeId    int    `json:"typeId"`
	CreatedAt string `json:"createdAt"`
	UpdatedAt string `json:"updatedAt"`
}

type TotalsJson struct {
	Cert     *TotalsColumns `json:"cert"`
	Soft     *TotalsColumns `json:"soft"`
	Proposed *TotalsColumns `json:"proposed"`
	OnChain  *TotalsColumns `json:"onChain"`
}

func (s *service) GetTotalFor(typeId int) *TotalsColumns {
	row := s.db.QueryRow(`
		SELECT * 
		FROM totals 
		WHERE typeId = ?`, typeId)

	var record = new(TotalsColumns)

	err := row.Scan(&record.Id, &record.Count, &record.TypeId, &record.CreatedAt, &record.UpdatedAt)
	if err != nil {
		logger.Error().Msgf("Error scanning: %v", err)
	}

	return record
}

func (s *service) GetAllTotals() *TotalsJson {
	rows, err := s.db.Query(`SELECT * FROM totals`)
	if err != nil {
		logger.Error().Msgf("Error preparing: %v", err)
	}

	var row = new(TotalsColumns)
	var t = new(TotalsJson)

	defer rows.Close()
	for rows.Next() {
		err := rows.Scan(&row.Id,
			&row.Count,
			&row.TypeId,
			&row.CreatedAt,
			&row.UpdatedAt)
		if err != nil {
			logger.Error().Msgf("Error scanning: %v", err)
		}

		total := new(TotalsColumns)
		// Covert struct to map
		total.Id = row.Id
		total.Count = row.Count
		total.TypeId = row.TypeId
		total.CreatedAt = string(row.CreatedAt)
		total.UpdatedAt = string(row.UpdatedAt)

		switch row.TypeId {
		case typeId.soft:
			t.Soft = total
		case typeId.cert:
			t.Cert = total
		case typeId.onChain:
			t.OnChain = total
		case typeId.proposed:
			t.Proposed = total
		}
	}

	if err = rows.Err(); err != nil {
		logger.Error().Msgf("Error iterating: %v", err)
	}

	return t
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
