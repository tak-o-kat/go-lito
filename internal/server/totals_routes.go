package server

import (
	"encoding/json"
	"go-lito/internal/parser"
	"net/http"
	"strconv"

	"github.com/julienschmidt/httprouter"
)

func getCurrentLogData(s *Server, data chan<- *parser.SortedData) {
	nodeData := parser.Parser(s.logger, s.logFile, s.account)
	data <- nodeData
}

func (s *Server) TotalsHandler(w http.ResponseWriter, r *http.Request) {
	s.logger.Info().Msgf("GET /api/totals/")

	// Grab the total votes from the current log
	resultData := make(chan *parser.SortedData)

	go getCurrentLogData(s, resultData)

	totals := s.db.GetAllTotals()

	result := <-resultData
	s.logger.Debug().Msgf("Total votes: %d", result.Totals)

	// add current totals to database totals
	totals.Cert.Count += result.Totals.CertVotes
	totals.Soft.Count += result.Totals.SoftVotes
	totals.Proposed.Count += result.Totals.BlocksProposed
	totals.OnChain.Count += result.Totals.BlocksOnChain

	jsonResp, err := json.Marshal(totals)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		s.logger.Error().Msgf("error handling JSON marshal. Err: %v", err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	_, _ = w.Write(jsonResp)
}

func (s *Server) TotalsIdHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	id := ps.ByName("id")
	s.logger.Info().Msgf("GET /api/totals/%s", id)
	if id == "" {
		http.Error(w, BAD_REQUEST+"Missing id parameter", http.StatusBadRequest)
		s.logger.Error().Msgf("Missing id parameter")
		return
	}

	idInt, err := strconv.Atoi(id)
	if err != nil {
		http.Error(w, BAD_REQUEST+"Invalid id parameter", http.StatusBadRequest)
		s.logger.Error().Msgf("Invalid id parameter. Err: %v", idInt)
		return
	}

	if idInt < 1 || idInt > 5 {
		http.Error(w, BAD_REQUEST+"Invalid id parameter", http.StatusBadRequest)
		s.logger.Error().Msgf("Invalid id parameter. Err: %v", idInt)
		return
	}

	jsonResp, err := json.Marshal(s.db.GetTotalFor(idInt))
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		s.logger.Error().Msgf("error handling JSON marshal. Err: %v", err)
	}

	w.Header().Set("Content-Type", "application/json")
	_, _ = w.Write(jsonResp)
}
