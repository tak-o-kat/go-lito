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

	// TODO: Add condition to check if id is valid less than or equal to 5

	jsonResp, err := json.Marshal(s.db.GetTotalFor(idInt))
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		s.logger.Error().Msgf("error handling JSON marshal. Err: %v", err)
	}

	w.Header().Set("Content-Type", "application/json")
	_, _ = w.Write(jsonResp)
}
