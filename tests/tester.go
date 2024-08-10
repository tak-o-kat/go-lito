package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/mattn/go-sqlite3" // Import the SQLite driver
)

// UpdateDateToUTC updates the date column from local time to RFC3339 UTC format.
func UpdateDateToUTC(db *sql.DB, tableName, dateColumn string) error {
	// Select the local date values
	rows, err := db.Query(fmt.Sprintf("SELECT id, round, %s FROM %s WHERE id = %d", dateColumn, tableName, 100))
	if err != nil {
		return fmt.Errorf("failed to select date column: %w", err)
	}
	defer rows.Close()

	for rows.Next() {
		var id int
		var localDate string
		var date string

		// Scan the id and local date from the row
		if err := rows.Scan(&id, &localDate, &date); err != nil {
			return fmt.Errorf("failed to scan row: %w", err)
		}

		fmt.Println(id, localDate, date)

		// Parse the local date
		// parsedLocalDate, err := time.Parse("2006-01-02 15:04:05", localDate)
		// if err != nil {
		// 	return fmt.Errorf("failed to parse local date: %w", err)
		// }

		// // Convert the parsed date to UTC in RFC3339 format
		// utcDate := parsedLocalDate.UTC().Format(time.RFC3339)

		// // Update the date column in the database with the UTC date
		// _, err = db.Exec(fmt.Sprintf("UPDATE %s SET %s = ? WHERE id = ?", tableName, dateColumn), utcDate, id)
		// if err != nil {
		// 	return fmt.Errorf("failed to update date column: %w", err)
		// }
	}

	if err := rows.Err(); err != nil {
		return fmt.Errorf("row iteration error: %w", err)
	}

	return nil
}

func main() {
	path := os.Getenv("ALGORAND_DATA")
	path += "/lito/"
	file := path + "golito.db"

	fmt.Println("Opening SQLite database:", file)

	// Open the SQLite database
	db, err := sql.Open("sqlite3", file)
	if err != nil {
		log.Fatal("Failed to open database:", err)
	}
	defer db.Close()

	// // Update the date column in the "events" table
	err = UpdateDateToUTC(db, "votes", "timestamp")
	if err != nil {
		log.Fatal("Failed to update date column:", err)
	}

	// fmt.Println("Date column successfully updated to UTC RFC3339 format.")
}
