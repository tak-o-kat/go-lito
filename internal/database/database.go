package database

import (
	"context"
	"database/sql"
	"fmt"
	"go-lito/internal/parser"
	"os"
	"path/filepath"
	"strconv"
	"time"

	_ "github.com/joho/godotenv/autoload"
	_ "github.com/mattn/go-sqlite3"
	"github.com/rs/zerolog"
)

// Service represents a service that interacts with a database.
type Service interface {
	// Verify Tables exist and default entries have been added
	CheckDefaultTables() bool

	// Create tables and default entries
	CreateTables()

	// Health returns a map of health status information.
	// The keys and values in the map are service-specific.
	Health() map[string]string

	// Close terminates the database connection.
	// It returns an error if the connection cannot be closed.
	Close() error

	// The following methods do CRUD operations on the database
	InsertNodeData(data *parser.SortedData)

	InsertTotals(totals *parser.Totals) error

	InsertProposals(proposals *[]parser.Blocks) error

	InsertVotes(votes *[]parser.Votes) error

	// Methods used to query totals table
	GetAllTotals() *TotalsJson

	GetTotalFor(typeId int) *TotalsColumns

	// Methods used to query Votes table
	GetOrderedVotes(rows int, order string) *VotesJson

	GetOrderedVotesByType(numRows int, order string, typeId int) *VotesJson

	GetVoteById(id int) *roundColumns

	GetVotesByDateRange(from string, to string) *VotesJson

	// Methods used to query Proposals table
	GetProposals(rows int) *[]parser.Blocks

	GetMinTimeStamp() string
}

type service struct {
	db *sql.DB
}

var (
	dburl      = os.Getenv("DB_NAME")
	dbInstance *service
	logger     *zerolog.Logger
)

func New(l *zerolog.Logger, dbPath string, dbFile string) Service {

	// Reuse Connection
	if dbInstance != nil {
		l.Info().Msg("Reusing dbInstance")
		return dbInstance
	}

	l.Info().Msg("Creating new dbInstance")
	// Add logger to service
	logger = l

	if dbFile == "" || dbPath == "" {
		logger.Fatal().Msg("No path and/or file specified for database")
	}
	dburl = filepath.Join(dbPath, dbFile)

	err := os.MkdirAll(dbPath, os.ModePerm)
	if err != nil {
		logger.Fatal().Msg(fmt.Sprintf("%s", err))
	}

	l.Debug().Msg("Opening database: " + dburl)
	db, err := sql.Open("sqlite3", dburl)
	if err != nil {
		// This will not be a connection error, but a DSN parse error or
		// another initialization error.
		logger.Fatal().Msg(fmt.Sprintf("%s", err))
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
		logger.Fatal().Msg(fmt.Sprintf("db down: %v", err)) // Log the error and terminate the program
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
func (s *service) Close() error {
	logger.Info().Msg(fmt.Sprintf("Disconnected from database: %s", dburl))
	return s.db.Close()
}

func (s *service) InsertNodeData(data *parser.SortedData) {
	// Insert Totals
	err := s.InsertTotals(data.Totals)
	if err != nil {
		logger.Error().Msg(fmt.Sprintf("Error inserting: %v", err))
	}

	// Insert Votes
	err = s.InsertVotes(data.Votes)
	if err != nil {
		logger.Error().Msg(fmt.Sprintf("Error inserting: %v", err))
	}

	// Insert Proposals
	err = s.InsertProposals(data.Proposed)
	if err != nil {
		logger.Error().Msg(fmt.Sprintf("Error inserting: %v", err))
	}
}

func (s *service) GetMinTimeStamp() string {
	// Create query and execute
	query := `
		SELECT MIN(v.timestamp) AS min_time
		FROM votes AS v
		UNION
		SELECT MIN(p.timestamp) AS min_time
		FROM proposed AS p
		LIMIT 1`

	row := s.db.QueryRow(query)
	var minTimeStamp string
	if err := row.Scan(&minTimeStamp); err != nil {
		logger.Error().Msg(fmt.Sprintf("Error scanning: %v", err))
	}

	if minTimeStamp == "" {
		minTimeStamp = time.Now().UTC().Format(time.RFC3339Nano)
	}

	return minTimeStamp
}
