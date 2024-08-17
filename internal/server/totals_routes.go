package server

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/julienschmidt/httprouter"
)

func (s *Server) TotalsHandler(w http.ResponseWriter, r *http.Request) {
	s.logger.Info().Msgf("GET /api/totals/")

	jsonResp, err := json.Marshal(s.db.GetAllTotals())

	if err != nil {
		s.logger.Fatal().Msgf("error handling JSON marshal. Err: %v", err)
	}

	w.Header().Set("Content-Type", "application/json")
	_, err = w.Write(jsonResp)
	if err != nil {
		s.logger.Fatal().Msgf("error writing response. Err: %v", err)
	}
}

func (s *Server) TotalsIdHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	id := ps.ByName("id")
	if id == "" {
		http.Error(w, "Missing id parameter", http.StatusBadRequest)
		return
	}

	idInt, err := strconv.Atoi(id)
	if err != nil {
		http.Error(w, "Invalid id parameter", http.StatusBadRequest)
		s.logger.Error().Msgf("Invalid id parameter. Err: %v", err)
		return
	}
	s.logger.Info().Msgf("GET /api/totals/%d", idInt)

	if idInt < 1 || idInt > 5 {
		http.Error(w, "Invalid id parameter", http.StatusBadRequest)
		s.logger.Error().Msgf("Invalid id parameter. Err: %v", idInt)
		return
	}

	// TODO: Add condition to check if id is valid less than or equal to 5

	jsonResp, err := json.Marshal(s.db.GetTotalFor(idInt))

	if err != nil {
		s.logger.Fatal().Msgf("error handling JSON marshal. Err: %v", err)
	}

	w.Header().Set("Content-Type", "application/json")
	_, err = w.Write(jsonResp)
	if err != nil {
		s.logger.Fatal().Msgf("error writing response. Err: %v", err)
	}
}
