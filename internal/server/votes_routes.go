package server

import (
	"encoding/json"
	"net/http"

	"github.com/julienschmidt/httprouter"
)

func (s *Server) votesDateRangeHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	fromParam := ps.ByName("from")
	toParam := ps.ByName("to")
	if fromParam == "" || toParam == "" {
		http.Error(w, "Missing id parameter", http.StatusBadRequest)
		return
	}

	jsonResp, err := json.Marshal(s.db.GetVotesByDateRange(fromParam, toParam))

	if err != nil {
		s.logger.Fatal().Msgf("error handling JSON marshal. Err: %v", err)
	}

	_, _ = w.Write(jsonResp)
}
