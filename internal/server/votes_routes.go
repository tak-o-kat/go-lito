package server

import (
	"encoding/json"
	"net/http"

	"github.com/julienschmidt/httprouter"
)

func (s *Server) voteIdHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	id, err := sanitizeId(ps.ByName("id"))
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		s.logger.Error().Msgf("error handling id. %v", err)
		return
	}

	resp, err := s.db.GetVoteById(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		s.logger.Error().Msgf("error handling request. %v", err)
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

func (s *Server) votesHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
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

	jsonResp, err := json.Marshal(s.db.GetSortedVotes(limit, order))
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		s.logger.Error().Msgf("error handling JSON marshal. %v", err)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	_, _ = w.Write(jsonResp)
}

func (s *Server) votesTypeIdHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
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
	if id != SOFT && id != CERT {
		http.Error(w, BAD_REQUEST+"invalid type id for votes", http.StatusBadRequest)
		s.logger.Error().Msgf("invalid type id for votes. %v", id)
		return
	}

	// Make db query call
	jsonResp, err := json.Marshal(s.db.GetSortedVotesByType(limit, order, id))
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		s.logger.Error().Msgf("error handling JSON marshal. %v", err)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	_, _ = w.Write(jsonResp)
}

func (s *Server) votesDateRangeHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	timeRange, err := s.sanitizeTimeStampRange(ps.ByName("from"), ps.ByName("to"))
	if err != nil {
		http.Error(w, BAD_REQUEST+err.Error(), http.StatusBadRequest)
		return
	}

	jsonResp, err := json.Marshal(s.db.GetVotesByDateRange(timeRange.From, timeRange.To))
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		s.logger.Error().Msgf("error handling JSON marshal. %v", err)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	_, _ = w.Write(jsonResp)
}

func (s *Server) votesDateRangeParamHandler(w http.ResponseWriter, r *http.Request) {
	fromParam := r.URL.Query().Get("from")
	toParam := r.URL.Query().Get("to")
	// typeIdParam := r.URL.Query().Get("typeid")

	timeRange, err := s.sanitizeTimeStampRange(fromParam, toParam)
	if err != nil {
		http.Error(w, BAD_REQUEST+err.Error(), http.StatusBadRequest)
		return
	}

	jsonResp, err := json.Marshal(s.db.GetVotesByDateRange(timeRange.From, timeRange.To))
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		s.logger.Error().Msgf("error handling JSON marshal. %v", err)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	_, _ = w.Write(jsonResp)
}
