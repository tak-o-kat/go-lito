package tests

import (
	"errors"
	"fmt"
	"go-lito/internal/database"
	"os"
	"testing"
	"time"

	_ "github.com/joho/godotenv/autoload"
	_ "github.com/mattn/go-sqlite3"
	"github.com/rs/zerolog"
)

func getLogger () *zerolog.Logger {
	level := zerolog.PanicLevel
	output := zerolog.ConsoleWriter{Out: os.Stderr, TimeFormat: time.RFC3339}
	output.FormatMessage = func(i interface{}) string {
		return fmt.Sprintf("%s", i)
	}
		// Set up global logger
	logger := zerolog.New(output).
		With().
		Caller().
		Int("pid", os.Getpid()).
		Timestamp().
		Logger().Level(level)

	return &logger
}

func Exists(name string) (bool, error) {
	_, err := os.Stat(name)
	if err == nil {
			return true, nil
	}
	if errors.Is(err, os.ErrNotExist) {
			return false, nil
	}
	return false, err
}

func TestCreateTables (t *testing.T) {
	logger := getLogger()
	expected := true

	path := os.Getenv("ALGORAND_DATA")
	path += "/lito"

	err := os.MkdirAll(path, os.ModePerm)
	if err != nil {
		t.Errorf("%s",err)
	}

	os.OpenFile(path + "/test.db", os.O_CREATE/os.O_RDWR, 0777)
	db := database.New(logger, "/test.db")

	// Test that tables do not exist
	expected = false
	got := db.CheckDefaultTables(logger)
	if expected != got {
		t.Errorf("expected %v; got %v", expected, got)
	}

	// Create tables and default entries
	database.CreateTables(logger)

	// Test if tables exist and if Tables 'types' and 'totals' have default entries
	expected = true
	got = db.CheckDefaultTables(logger)

	if expected != got {
		t.Errorf("expected %v; got %v", expected, got)
	}

	// Close database and remove test.db
	db.Close(&zerolog.Logger{})
	os.Remove(path + "/test.db")
}