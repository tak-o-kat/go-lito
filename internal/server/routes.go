package server

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"github.com/julienschmidt/httprouter"
)

const (
	SOFT     = 1
	CERT     = 2
	PROPOSED = 3
	ONCHAIN  = 4
	FROZEN   = 5
)

func (s *Server) RegisterRoutes() http.Handler {
	s.logger.Debug().Msg("Registering routes")
	r := httprouter.New()

	r.HandlerFunc(http.MethodGet, "/health", s.healthHandler)

	// Routes for /api/totals
	r.HandlerFunc(http.MethodGet, "/api/totals/", s.totalsHandler)
	r.GET("/api/totals/:id", s.totalsIdHandler)

	// TODO: Add routes for /api/votes and /api/votes/:id
	r.GET("/api/votes/asc/:num", s.votesAscHandler)         // returns num votes asc by limit
	r.GET("/api/votes/desc/:num", s.votesDescHandler)       // returns num votes desc by limit
	r.GET("/api/votes/type/:id/:num", s.votesTypeIdHandler) // return votes by type (SOFT or CERT)
	r.GET("/api/vote/:id", s.voteIdHandler)                 // return 1 vote by it's id

	return r
}

func (s *Server) healthHandler(w http.ResponseWriter, r *http.Request) {
	jsonResp, err := json.Marshal(s.db.Health())

	if err != nil {
		log.Fatalf("error handling JSON marshal. Err: %v", err)
	}

	_, _ = w.Write(jsonResp)
}

func (s *Server) totalsHandler(w http.ResponseWriter, r *http.Request) {
	jsonResp, err := json.Marshal(s.db.GetAllTotals())

	if err != nil {
		log.Fatalf("error handling JSON marshal. Err: %v", err)
	}

	_, _ = w.Write(jsonResp)
}

func (s *Server) totalsIdHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
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

	// TODO: Add condition to check if id is valid less than or equal to 5

	jsonResp, err := json.Marshal(s.db.GetTotalFor(idInt))

	if err != nil {
		log.Fatalf("error handling JSON marshal. Err: %v", err)
	}

	_, _ = w.Write(jsonResp)
}

func (s *Server) votesAscHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	num := ps.ByName("num")
	if num == "" {
		http.Error(w, "Missing id parameter", http.StatusBadRequest)
		return
	}

	limit, err := strconv.Atoi(num)
	if err != nil {
		http.Error(w, "Invalid id parameter", http.StatusBadRequest)
		return
	}

	jsonResp, err := json.Marshal(s.db.GetOrderedVotes(limit, "ASC"))

	if err != nil {
		log.Fatalf("error handling JSON marshal. Err: %v", err)
	}

	_, _ = w.Write(jsonResp)
}

func (s *Server) votesDescHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	num := ps.ByName("num")
	if num == "" {
		http.Error(w, "Missing id parameter", http.StatusBadRequest)
		return
	}

	limit, err := strconv.Atoi(num)
	if err != nil {
		http.Error(w, "Invalid id parameter", http.StatusBadRequest)
		return
	}

	jsonResp, err := json.Marshal(s.db.GetOrderedVotes(limit, "DESC"))

	if err != nil {
		log.Fatalf("error handling JSON marshal. Err: %v", err)
	}

	_, _ = w.Write(jsonResp)
}

func (s *Server) voteIdHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	jsonResp, err := json.Marshal(s.db.GetAllTotals())

	if err != nil {
		log.Fatalf("error handling JSON marshal. Err: %v", err)
	}

	_, _ = w.Write(jsonResp)
}

func (s *Server) votesTypeIdHandler(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	jsonResp, err := json.Marshal(s.db.GetAllTotals())

	if err != nil {
		log.Fatalf("error handling JSON marshal. Err: %v", err)
	}

	_, _ = w.Write(jsonResp)
}
