package server

import (
	"encoding/json"
	"net/http"

	"github.com/julienschmidt/httprouter"
)

func (s *Server) proposalIdHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	id, err := sanitizeId(ps.ByName("id"))
	if err != nil {
		http.Error(w, BAD_REQUEST+err.Error(), http.StatusBadRequest)
		return
	}

	resp, err := s.db.GetProposalById(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		s.logger.Error().Msgf("error handling request, %v", err)
		return
	}

	jsonResp, err := json.Marshal(resp)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		s.logger.Error().Msgf("error handling JSON marshal. %v", err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	_, _ = w.Write(jsonResp)
}

func (s *Server) proposalsHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	limit, err := sanitizeLimit(ps.ByName("limit"))
	if err != nil {
		http.Error(w, BAD_REQUEST+err.Error(), http.StatusBadRequest)
		return
	}

	order, err := sanitizeSort(ps.ByName("sort"))
	if err != nil {
		http.Error(w, BAD_REQUEST+err.Error(), http.StatusBadRequest)
		return
	}

	jsonResp, err := json.Marshal(s.db.GetSortedProposals(limit, order))
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		s.logger.Error().Msgf("error handling JSON marshal. %v", err)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	_, _ = w.Write(jsonResp)
}

func (s *Server) proposalsTypeIdHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	id, err := sanitizeId(ps.ByName("id"))
	if err != nil {
		http.Error(w, BAD_REQUEST+err.Error(), http.StatusBadRequest)
		s.logger.Error().Msgf("error handling id. %v", err)
		return
	}

	limit, err := sanitizeLimit(ps.ByName("limit"))
	if err != nil {
		http.Error(w, BAD_REQUEST+err.Error(), http.StatusBadRequest)
		s.logger.Error().Msgf("error handling limit. %v", err)
		return
	}

	order, err := sanitizeSort(ps.ByName("sort"))
	if err != nil {
		http.Error(w, BAD_REQUEST+err.Error(), http.StatusBadRequest)
		s.logger.Error().Msgf("error handling sort. %v", err)
		return
	}

	// Check to make sure the typeid is valid for votes
	if id != PROPOSED && id != ONCHAIN {
		http.Error(w, BAD_REQUEST+"invalid type id for proposals", http.StatusBadRequest)
		s.logger.Error().Msgf("invalid type id for proposals. %v", id)
		return
	}

	// Make db query call
	jsonResp, err := json.Marshal(s.db.GetSortedProposalsByType(limit, order, id))
	if err != nil {
		http.Error(w, BAD_REQUEST+err.Error(), http.StatusBadRequest)
		s.logger.Error().Msgf("error handling JSON marshal. %v", err)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	_, _ = w.Write(jsonResp)
}

func (s *Server) proposalsDateRangeHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	timeRange, err := s.sanitizeTimeStampRange(ps.ByName("from"), ps.ByName("to"))
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		s.logger.Error().Msgf("error handling time range. %v", err)
		return
	}

	jsonResp, err := json.Marshal(s.db.GetProposalsByDateRange(timeRange.From, timeRange.To))

	if err != nil {
		s.logger.Fatal().Msgf("error handling JSON marshal. %v", err)
	}
	w.Header().Set("Content-Type", "application/json")
	_, _ = w.Write(jsonResp)
}
