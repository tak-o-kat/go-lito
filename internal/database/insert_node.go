package database

import (
	"fmt"
	"go-lito/internal/parser"
)

type typeIds struct {
	soft     int
	cert     int
	proposed int
	onChain  int
	frozen   int
}

type currentTotals struct {
	soft     int
	cert     int
	proposed int
	onChain  int
	frozen   int
}

var (
	typeId = typeIds{
		soft:     1,
		cert:     2,
		proposed: 3,
		onChain:  4,
		frozen:   5,
	}

	current = currentTotals{
		soft:     0,
		cert:     0,
		proposed: 0,
		onChain:  0,
		frozen:   0,
	}
)

func (s *service) getTotalCountFrom(id int) int {
	row := s.db.QueryRow(`
		SELECT count
		FROM totals 
		WHERE id = ?`, id)

	var count int
	row.Scan(&count)
	return count
}

func (s *service) InsertTotals(totals *parser.Totals) error {
	logger.Debug().Msgf("Inserting: %v", *totals)

	current.soft = s.getTotalCountFrom(typeId.soft)
	current.cert = s.getTotalCountFrom(typeId.cert)
	current.proposed = s.getTotalCountFrom(typeId.proposed)
	current.onChain = s.getTotalCountFrom(typeId.onChain)

	query := `UPDATE totals SET count = ? WHERE id = ?`

	// Update soft votes totals
	_, err := s.db.Exec(query, current.soft+totals.SoftVotes, typeId.soft)
	if err != nil {
		logger.Error().Msg(fmt.Sprintf("Error preparing: %v", err))
		return err
	}

	// Update cert votes totals
	_, err = s.db.Exec(query, current.cert+totals.CertVotes, typeId.cert)
	if err != nil {
		logger.Error().Msg(fmt.Sprintf("Error preparing: %v", err))
		return err
	}

	// Update Proposed totals
	_, err = s.db.Exec(query, current.proposed+totals.BlocksProposed, typeId.proposed)
	if err != nil {
		logger.Error().Msg(fmt.Sprintf("Error preparing: %v", err))
		return err
	}

	// Update OnChain totals
	_, err = s.db.Exec(query, current.onChain+totals.BlocksOnChain, typeId.onChain)
	if err != nil {
		logger.Error().Msg(fmt.Sprintf("Error preparing: %v", err))
		return err
	}

	return nil
}

func (s *service) InsertVotes(votes *[]parser.Votes) error {
	tx, err := s.db.Begin()
	if err != nil {
		logger.Error().Msg(fmt.Sprintf("Error starting transaction: %v", err))
		return err
	}

	// id, round, timestamp, typeid, created_at
	stmt, err := tx.Prepare("INSERT INTO votes(round, timestamp, typeId) VALUES(?, ?, ?)")
	if err != nil {
		logger.Error().Msg(fmt.Sprintf("Error preparing: %v", err))
		return err
	}

	for _, vote := range *votes {
		_, err := stmt.Exec(vote.Round, vote.TimeStamp, vote.Type)
		if err != nil {
			logger.Error().Msg(fmt.Sprintf("Error inserting: %v", err))
			return err
		}
	}

	err = tx.Commit()
	if err != nil {
		logger.Error().Msg(fmt.Sprintf("Error committing transaction: %v", err))
		return err
	}

	logger.Debug().Msg(fmt.Sprintf("Inserted: %d records", len(*votes)))

	return nil
}

func (s *service) InsertProposals(proposed *[]parser.Blocks) error {
	tx, err := s.db.Begin()
	if err != nil {
		logger.Error().Msg(fmt.Sprintf("Error starting transaction: %v", err))
		return err
	}

	// id, round, timestamp, typeid, created_at
	stmt, err := tx.Prepare(`
		INSERT INTO proposed(round, timestamp, typeId, onChain, blockTime) 
		VALUES(?, ?, ?, ?, ?)`)
	if err != nil {
		logger.Error().Msg(fmt.Sprintf("Error preparing: %v", err))
		return err
	}

	for _, block := range *proposed {
		// Determine if typeId is onChain or proposed
		typeIdentifier := typeId.proposed
		onChain := false
		if block.IsOnChain {
			typeIdentifier = typeId.onChain
			onChain = true
		}
		_, err := stmt.Exec(block.Round, block.TimeStamp, typeIdentifier, onChain, block.BlockTime)
		if err != nil {
			logger.Error().Msg(fmt.Sprintf("Error inserting: %v", err))
			return err
		}
	}

	err = tx.Commit()
	if err != nil {
		logger.Error().Msg(fmt.Sprintf("Error committing transaction: %v", err))
		return err
	}

	logger.Debug().Msg(fmt.Sprintf("Inserted: %d records", len(*proposed)))

	// dateString := (*proposed)[0].TimeStamp
	// date, err := time.Parse(time.RFC3339, dateString)
	// if err != nil {
	// 	logger.Error().Msg(fmt.Sprintf("Error parsing date: %v", err))
	// 	return err
	// }
	// logger.Debug().Msgf("Date: %v", date.Format("2006-01-02 15:04:05"))
	// logger.Debug().Msgf("Date: %T", date)
	return nil
}
