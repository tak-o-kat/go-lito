package server

import (
	"encoding/json"
	"go-lito/internal/parser"
	"net/http"
)

func (s *Server) logsHandler(w http.ResponseWriter, r *http.Request) {
	s.logger.Info().Msgf("GET /api/logs/")

	nodeData := parser.Parser(s.logger, s.logFile, s.account)
	jsonResp, err := json.Marshal(nodeData)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		s.logger.Error().Msgf("error handling JSON marshal. Err: %v", err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	_, _ = w.Write(jsonResp)
}
