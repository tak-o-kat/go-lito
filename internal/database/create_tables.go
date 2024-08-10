package database

import (
	"fmt"
)

func (s *service) CheckDefaultTables() bool {
	// Check if tables exist
	exists := true
	var name string

	tableExists := `SELECT name FROM sqlite_master WHERE type='table' AND name=?`
	row := dbInstance.db.QueryRow(tableExists, "proposed")
	if err := row.Scan(&name); err != nil {
		logger.Warn().Msg(fmt.Sprintf("No Table info => %v", err))
		return false
	}
	row = dbInstance.db.QueryRow(tableExists, "votes")
	if err := row.Scan(&name); err != nil {
		logger.Warn().Msg(fmt.Sprintf("No Table info => %v", err))
		return false
	}
	row = dbInstance.db.QueryRow(tableExists, "types")
	if err := row.Scan(&name); err != nil {
		logger.Warn().Msg(fmt.Sprintf("No Table info => %v", err))
		return false
	}
	row = dbInstance.db.QueryRow(tableExists, "totals")
	if err := row.Scan(&name); err != nil {
		logger.Warn().Msg(fmt.Sprintf("No Table info => %v", err))
		return false
	}
	return exists
}

func (s *service) CreateTables() {

	// Check if tables exist
	exists := s.CheckDefaultTables()

	if exists {
		return
	} else {
		// Tables don't exist, create them
		logger.Debug().Msg("Creating tables")
		blocks := `CREATE TABLE IF NOT EXISTS types (
		id 					INTEGER NOT NULL,
		typeName 				TEXT NOT NULL,
		createdAt 	DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

		PRIMARY KEY (id AUTOINCREMENT)
		);
		CREATE TABLE IF NOT EXISTS proposed (
			id 					INTEGER NOT NULL,
			round 			INTEGER,
			timestamp 	DATETIME NOT NULL,
			typeId    	INTEGER NOT NULL,
			onChain   	INTEGER NULL,
			blockTime 	REAL NULL,
			createdAt 	DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

			PRIMARY KEY (id AUTOINCREMENT),
			FOREIGN KEY (typeId) REFERENCES Types (id)
		);
		CREATE TABLE IF NOT EXISTS votes (
			id 					INTEGER NOT NULL,
			round 			INTEGER,
			timestamp 	DATETIME NOT NULL,
			typeId    	INTEGER NOT NULL,
			createdAt 	DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

			PRIMARY KEY (id AUTOINCREMENT),
			FOREIGN KEY (typeId) REFERENCES Types (id)
		);
		CREATE TABLE IF NOT EXISTS totals (
			id        	INTEGER NOT NULL,
			count    		INTEGER NOT NULL,
			typeId    	INTEGER NOT NULL,
			createdAt 	DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
			updatedAt 	DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

			PRIMARY KEY (id),
			FOREIGN KEY (typeId) REFERENCES Types (id)
		);`
		logger.Debug().Msg("Creating default types and totals")
		if _, err := dbInstance.db.Exec(blocks); err != nil {
			logger.Error().Msg(fmt.Sprintf("%s", err))
		}

		addTypes := `INSERT INTO types (typeName) VALUES
			('soft'),
			('certified'),
			('proposed'),
			('onchain'),
			('frozen');`

		if _, err := dbInstance.db.Exec(addTypes); err != nil {
			logger.Error().Msg(fmt.Sprintf("%s", err))
		}

		addTotals := `INSERT INTO totals (count, typeId) VALUES
			(0, 1),
			(0, 2),
			(0, 3),
			(0, 4),
			(0, 5);`

		if _, err := dbInstance.db.Exec(addTotals); err != nil {
			logger.Error().Msg(fmt.Sprintf("%s", err))
		}
	}
}
