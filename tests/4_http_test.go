package tests

import (
	"go-lito/cmd/lito"
	"go-lito/internal/server"
	"io"
	"net/http"
	"net/http/httptest"
	"testing"
)

var Path4 = lito.GetLitoPath()

var CFG4 = lito.Config{
	EnvVar:   "ALGORAND_DATA",
	LitoPath: Path4,
	Database: "golito.db",
	LogFile:  "archives.log",
	Output:   "test.log",
	Loglevel: "DEBUG",
	Account:  "",
	Port:     "8081",
}

func TestApiHandler(t *testing.T) {
	s := &server.Server{}
	server := httptest.NewServer(http.HandlerFunc(s.TestHandler))
	defer server.Close()
	resp, err := http.Get(server.URL)
	if err != nil {
		t.Fatalf("error making request to server. Err: %v", err)
	}
	defer resp.Body.Close()
	// Assertions
	if resp.StatusCode != http.StatusOK {
		t.Errorf("expected status OK; got %v", resp.Status)
	}
	expected := "{\"message\":\"Test World!\"}"
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		t.Fatalf("error reading response body. Err: %v", err)
	}
	if expected != string(body) {
		t.Errorf("expected response body to be %v; got %v", expected, string(body))
	}
}
