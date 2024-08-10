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
	r.GET("/api/votes/limit/:limit/:order", s.votesHandler)           // returns num votes asc by limit
	r.GET("/api/votes/typeid/:id/:limit/:order", s.voteTypeIdHandler) // return votes by type (SOFT or CERT) asc
	r.GET("/api/voteid/:id", s.voteIdHandler)                         // return 1 vote by it's id

	// Add a range for votes by type and all
	// The Following will also have endpoints for counts of vote types and all votes
	// Add all votes in the last 1, 6, 12, and 24 hours
	// Add all votes in the last day, 2 days, 3 days, and 7 days
	// add all votes in the last 1 week or 2 weeks
	// add all votes in the last 1 month or 2 months, 6 months, or 1 year

	// ex. /api/votes/from/{timestamp}/to/{timestamp}
	r.GET("/api/votes/from/:from/to/:to", s.votesDateRange)

	// ex. /api/votes?from={timestamp}&to={timestamp}
	r.HandlerFunc(http.MethodGet, "/api/votes/range/", s.votesDateRangeHandler)

	// Add routes for proposals and onchain

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
