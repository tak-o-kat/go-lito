package database

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"log/slog"
	"os"
	"strconv"
	"time"

	_ "github.com/joho/godotenv/autoload"
	_ "github.com/mattn/go-sqlite3"
	"github.com/rs/zerolog"
)

// Service represents a service that interacts with a database.
type Service interface {
	// Verify Tables exist and default entries have been added
	CheckDefaultTables(l *zerolog.Logger) bool

	// Health returns a map of health status information.
	// The keys and values in the map are service-specific.
	Health() map[string]string

	// Close terminates the database connection.
	// It returns an error if the connection cannot be closed.
	Close(l *zerolog.Logger) error
}

type service struct {
	db *sql.DB
}

var (
	dburl      = os.Getenv("DB_NAME")
	dbInstance *service
)

func CreateTables(l *zerolog.Logger) {
	
	// Check if tables exist
	exists := dbInstance.CheckDefaultTables(l)

	if exists {
		return
	} else {
		// Tables don't exist, create them
		l.Debug().Msg("Creating tables")
		blocks := `CREATE TABLE IF NOT EXISTS types (
		id 					INTEGER NOT NULL,
		type 				TEXT NOT NULL,
		created_at 	DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

		PRIMARY KEY (id AUTOINCREMENT)
		);
		CREATE TABLE IF NOT EXISTS proposed (
			id 					INTEGER NOT NULL,
			round 			INTEGER,
			timestamp 	DATETIME NOT NULL,
			typeId    	INTEGER NOT NULL,
			onChain   	INTEGER NULL,
			created_at 	DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

			PRIMARY KEY (id AUTOINCREMENT),
			FOREIGN KEY (typeId) REFERENCES Types (id)
		);
		CREATE TABLE IF NOT EXISTS votes (
			id 					INTEGER NOT NULL,
			round 			INTEGER,
			timestamp 	DATETIME NOT NULL,
			typeId    	INTEGER NOT NULL,
			created_at 	DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

			PRIMARY KEY (id AUTOINCREMENT),
			FOREIGN KEY (typeId) REFERENCES Types (id)
		);
		CREATE TABLE IF NOT EXISTS totals (
			id        	INTEGER NOT NULL,
			count    		INTEGER NOT NULL,
			typeId    	INTEGER NOT NULL,
			created_at 	DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
			updatedAt 	DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

			PRIMARY KEY (id),
			FOREIGN KEY (typeId) REFERENCES Types (id)
		);`
		l.Debug().Msg("Creating default types and totals")
		if _, err := dbInstance.db.Exec(blocks); err != nil {
			l.Error().Msg(fmt.Sprintf("%s", err))
			// slog.Error(fmt.Sprintf("%s",err))
		}

		addTypes := `INSERT INTO types (type) VALUES
			('onchain'),
			('proposed'),
			('soft'),
			('certified'),
			('frozen');`

		if _, err := dbInstance.db.Exec(addTypes); err != nil {
			slog.Error(fmt.Sprintf("%s", err))

		}

		addTotals := `INSERT INTO totals (count, typeId) VALUES
			(0, 1),
			(0, 2),
			(0, 3),
			(0, 4),
			(0, 5);`

		if _, err := dbInstance.db.Exec(addTotals); err != nil {
			slog.Error(fmt.Sprintf("%s", err))
		}
	}
}

func New(l *zerolog.Logger, dbFile string) Service {
	// Reuse Connection
	if dbInstance != nil {
		return dbInstance
	}

	if dbFile == "" {
		l.Debug().Msg("dbFile is Empty, using default env variable")
		dbFile = os.Getenv("DB_NAME")
		dburl = dbFile
	} else {
		dburl = dbFile
	}

	// Create lito folder in ALGORAND_DATA
	path, _ := os.LookupEnv("ALGORAND_DATA")
	path += "/lito"

	err := os.MkdirAll(path, 0777)
	if err != nil {
		l.Fatal().Msg(fmt.Sprintf("%s", err))
	}

	db, err := sql.Open("sqlite3", path + dbFile)
	if err != nil {
		// This will not be a connection error, but a DSN parse error or
		// another initialization error.
		l.Fatal().Msg(fmt.Sprintf("%s", err))
	}

	dbInstance = &service{
		db: db,
	}

	return dbInstance
}

// Health checks the health of the database connection by pinging the database.
// It returns a map with keys indicating various health statistics.
func (s *service) Health() map[string]string {
	ctx, cancel := context.WithTimeout(context.Background(), 1*time.Second)
	defer cancel()

	stats := make(map[string]string)

	// Ping the database
	err := s.db.PingContext(ctx)
	if err != nil {
		stats["status"] = "down"
		stats["error"] = fmt.Sprintf("db down: %v", err)
		log.Fatalf(fmt.Sprintf("db down: %v", err)) // Log the error and terminate the program
		return stats
	}

	// Database is up, add more statistics
	stats["status"] = "up"
	stats["message"] = "It's healthy"

	// Get database stats (like open connections, in use, idle, etc.)
	dbStats := s.db.Stats()
	stats["open_connections"] = strconv.Itoa(dbStats.OpenConnections)
	stats["in_use"] = strconv.Itoa(dbStats.InUse)
	stats["idle"] = strconv.Itoa(dbStats.Idle)
	stats["wait_count"] = strconv.FormatInt(dbStats.WaitCount, 10)
	stats["wait_duration"] = dbStats.WaitDuration.String()
	stats["max_idle_closed"] = strconv.FormatInt(dbStats.MaxIdleClosed, 10)
	stats["max_lifetime_closed"] = strconv.FormatInt(dbStats.MaxLifetimeClosed, 10)

	// Evaluate stats to provide a health message
	if dbStats.OpenConnections > 40 { // Assuming 50 is the max for this example
		stats["message"] = "The database is experiencing heavy load."
	}

	if dbStats.WaitCount > 1000 {
		stats["message"] = "The database has a high number of wait events, indicating potential bottlenecks."
	}

	if dbStats.MaxIdleClosed > int64(dbStats.OpenConnections)/2 {
		stats["message"] = "Many idle connections are being closed, consider revising the connection pool settings."
	}

	if dbStats.MaxLifetimeClosed > int64(dbStats.OpenConnections)/2 {
		stats["message"] = "Many connections are being closed due to max lifetime, consider increasing max lifetime or revising the connection usage pattern."
	}

	return stats
}

// Close closes the database connection.
// It logs a message indicating the disconnection from the specific database.
// If the connection is successfully closed, it returns nil.
// If an error occurs while closing the connection, it returns the error.
func (s *service) Close(l *zerolog.Logger) error {
	l.Info().Msg(fmt.Sprintf("Disconnected from database: %s", dburl))
	return s.db.Close()
}

func (s *service) CheckDefaultTables(l *zerolog.Logger) bool {
	// Check if tables exist
	exists := true
	var name string

	tableExists := `SELECT name FROM sqlite_master WHERE type='table' AND name=?`
	row := dbInstance.db.QueryRow(tableExists, "proposed")
	if err := row.Scan(&name); err != nil {
		l.Warn().Msg(fmt.Sprintf("Error checking if tables exist => %v", err))
		return false
	}
	row = dbInstance.db.QueryRow(tableExists, "votes")
	if err := row.Scan(&name); err != nil {
		l.Warn().Msg(fmt.Sprintf("Error checking if tables exist => %v", err))
		return false
	}
	row = dbInstance.db.QueryRow(tableExists, "types")
	if err := row.Scan(&name); err != nil {
		l.Warn().Msg(fmt.Sprintf("Error checking if tables exist => %v", err))
		return false
	}
	row = dbInstance.db.QueryRow(tableExists, "totals")
	if err := row.Scan(&name); err != nil {
		l.Warn().Msg(fmt.Sprintf("Error checking if tables exist => %v", err))
		return false
	}
	return exists
}
