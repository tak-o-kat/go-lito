package server

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/julienschmidt/httprouter"
)

const UPPER_NUM_LIMIT = 10000

type Range struct {
	From string `json:"from"`
	To   string `json:"to"`
}

func sanitizeLimit(num string) (int, error) {
	if num == "" {
		return 0, fmt.Errorf("empty limit value")
	}

	limit, err := strconv.Atoi(num)
	if err != nil {
		return 0, fmt.Errorf("invalid number")
	}

	if limit < 1 || limit > UPPER_NUM_LIMIT {
		return 0, fmt.Errorf("limit value must be between 1 and %d", UPPER_NUM_LIMIT)
	}

	return limit, nil
}

func sanitizeId(num string) (int, error) {
	if num == "" {
		return 0, fmt.Errorf("empty id value")
	}

	id, err := strconv.Atoi(num)
	if err != nil {
		return 0, fmt.Errorf("invalid number")
	}

	if id < 1 {
		return 0, fmt.Errorf("id value must be greater than 0")
	}

	return id, nil
}

func sanitizeTime(tp string) (string, error) {
	if tp == "" {
		return "", fmt.Errorf("empty from value")
	}

	timeParam, err := time.Parse(time.RFC3339Nano, tp)
	if err != nil {
		return "", fmt.Errorf("invalid timestamp value: %v", err)
	}

	utcTime := timeParam.UTC().Format(time.RFC3339Nano)

	return utcTime, nil
}

func (s *Server) votesHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	limit, err := sanitizeLimit(ps.ByName("limit"))
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	order := ps.ByName("order")
	// if order is empty default to asc
	if order == "" {
		order = "asc"
	}

	if strings.ToLower(order) != "asc" && strings.ToLower(order) != "desc" {
		http.Error(w, "invalid order value", http.StatusBadRequest)
		return
	}

	jsonResp, err := json.Marshal(s.db.GetOrderedVotes(limit, order))

	if err != nil {
		log.Fatalf("error handling JSON marshal. Err: %v", err)
	}

	_, _ = w.Write(jsonResp)
}

func (s *Server) voteTypeIdHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	id, err := sanitizeId(ps.ByName("id"))
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	limit, err := sanitizeLimit(ps.ByName("limit"))
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	order := ps.ByName("order")
	// if order is empty default to asc
	if order == "" {
		order = "asc"
	}

	if strings.ToLower(order) != "asc" && strings.ToLower(order) != "desc" {
		http.Error(w, "invalid order value", http.StatusBadRequest)
		return
	}

	// Check to make sure the typeid is valid for votes
	if id != SOFT && id != CERT {
		http.Error(w, "invalid type id for votes", http.StatusBadRequest)
		return
	}

	// Make db query call
	jsonResp, err := json.Marshal(s.db.GetOrderedVotesByType(limit, order, id))

	if err != nil {
		log.Fatalf("error handling JSON marshal. Err: %v", err)
	}

	_, _ = w.Write(jsonResp)
}

func (s *Server) voteIdHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	id := ps.ByName("id")
	if id == "" {
		http.Error(w, "Missing id parameter", http.StatusBadRequest)
		return
	}

	idInt, err := strconv.Atoi(id)
	if err != nil {
		http.Error(w, "Invalid id parameter", http.StatusBadRequest)
		return
	}

	jsonResp, err := json.Marshal(s.db.GetVoteById(idInt))

	if err != nil {
		log.Fatalf("error handling JSON marshal. Err: %v", err)
	}

	_, _ = w.Write(jsonResp)
}

func (s *Server) votesDateRange(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	// fromParam, err := sanitizeTime(ps.ByName("from"))
	// if err != nil {
	// 	http.Error(w, err.Error(), http.StatusBadRequest)
	// 	return
	// }

	// minTimeStamp := s.db.GetMinTimeStamp()
	// if fromParam < minTimeStamp {
	// 	http.Error(w, fmt.Sprintf("from value must be greater than or equal to %s", minTimeStamp), http.StatusBadRequest)
	// 	return
	// }

	// toParam, err := sanitizeTime(ps.ByName("to"))
	// if err != nil {
	// 	http.Error(w, err.Error(), http.StatusBadRequest)
	// 	return
	// }

	// maxTimeStamp := time.Now().UTC().Format(time.RFC3339Nano)
	// if toParam > maxTimeStamp {
	// 	http.Error(w, fmt.Sprintf("to value must be less than or equal to %s", maxTimeStamp), http.StatusBadRequest)
	// 	return
	// }

	timeRange, err := s.sanitizeTimeStampRange(ps.ByName("from"), ps.ByName("to"))
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	jsonResp, err := json.Marshal(s.db.GetVotesByDateRange(timeRange.From, timeRange.To))

	if err != nil {
		s.logger.Fatal().Msgf("error handling JSON marshal. Err: %v", err)
	}

	_, _ = w.Write(jsonResp)
}

func (s *Server) sanitizeTimeStampRange(from string, to string) (Range, error) {
	fromParam, err := sanitizeTime(from)
	if err != nil {
		s.logger.Error().Msgf("error handling JSON marshal. Err: %v", err)
		return Range{}, err
	}

	minTimeStamp := s.db.GetMinTimeStamp()
	if fromParam < minTimeStamp {
		return Range{}, fmt.Errorf("'from' value must be greater than or equal to %s", minTimeStamp)
	}

	toParam, err := sanitizeTime(to)
	if err != nil {
		s.logger.Error().Msgf("error handling JSON marshal. Err: %v", err)
		return Range{}, err
	}

	maxTimeStamp := time.Now().UTC().Format(time.RFC3339Nano)
	if toParam > maxTimeStamp {
		return Range{}, fmt.Errorf("'to' value must be less than or equal to %s", maxTimeStamp)
	}

	// Finally make sure from is less than to
	if fromParam >= toParam {
		return Range{}, fmt.Errorf("'from' value must be less than the 'to' value")
	}

	return Range{fromParam, toParam}, nil
}

func (s *Server) votesDateRangeHandler(w http.ResponseWriter, r *http.Request) {
	// fromParam := r.URL.Query().Get("from")
	// toParam := r.URL.Query().Get("to")
	// typeIdParam := r.URL.Query().Get("typeid")

	// jsonResp, err := json.Marshal(s.db.GetVotesByDateRange(fromParam, toParam))

	// if err != nil {
	// 	s.logger.Fatal().Msgf("error handling JSON marshal. Err: %v", err)
	// }

	// _, _ = w.Write(jsonResp)
}
