package tests

import (
	"errors"
	"go-lito/internal/database"
	"os"
	"testing"

	_ "github.com/joho/godotenv/autoload"
	_ "github.com/mattn/go-sqlite3"
	"github.com/rs/zerolog"
)

func TestDatabase (t *testing.T) {
	expected := true
	db := database.New(&zerolog.Logger{}, "/test.db")

	path := os.Getenv("ALGORAND_DATA")
	path += "/lito/test.db"

	// Test if database file exists
	_, err := os.Stat(path)
	got := !errors.Is(err, os.ErrNotExist)

	if expected != got {
		t.Errorf("expected %v; got %v", expected, got)
	}

	// Test health and close
	db.Health()
	db.Close(&zerolog.Logger{})

	os.Remove(path)

}