package server

import (
	"encoding/json"
	"log"
	"net/http"

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
	s.logger.Info().Msg("Registering routes")
	r := httprouter.New()

	r.HandlerFunc(http.MethodGet, "/health", s.healthHandler)
	r.HandlerFunc(http.MethodGet, "/test", s.TestHandler)

	// Routes for /api/totals
	r.HandlerFunc(http.MethodGet, "/api/totals/", s.TotalsHandler)
	r.GET("/api/totalid/:id", s.TotalsIdHandler)

	// TODO: Add routes for /api/votes and /api/votes/:id
	r.GET("/api/votes/limit/:limit/:sort", s.votesHandler)            // returns num votes asc by limit
	r.GET("/api/votes/typeid/:id/:limit/:sort", s.votesTypeIdHandler) // return votes by type (SOFT or CERT) asc
	r.GET("/api/voteid/:id", s.voteIdHandler)                         // return 1 vote by it's id

	// ex. /api/votes/from/{timestamp}/to/{timestamp}
	r.GET("/api/votes/from/:from/to/:to", s.votesDateRangeHandler)

	// ex. /api/votes?from={timestamp}&to={timestamp}&limit={number}&order={asc|desc}
	r.HandlerFunc(http.MethodGet, "/api/votes/range", s.votesDateRangeParamHandler)

	// Add routes for proposals and onchain
	r.GET("/api/proposals/limit/:limit/:sort", s.proposalsHandler)            // returns num proposals asc by limit
	r.GET("/api/proposals/typeid/:id/:limit/:sort", s.proposalsTypeIdHandler) // return votes by type (SOFT or CERT) asc
	r.GET("/api/proposalid/:id", s.proposalIdHandler)

	// ex. /api/proposals/from/{timestamp}/to/{timestamp}
	r.GET("/api/proposals/from/:from/to/:to", s.proposalsDateRangeHandler)

	return r
}

func (s *Server) TestHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	resp := make(map[string]string)
	resp["message"] = "Test World!"
	jsonResp, err := json.Marshal(resp)
	if err != nil {
		log.Fatalf("error handling JSON marshal. Err: %v", err)
	}
	_, _ = w.Write(jsonResp)
}

func (s *Server) healthHandler(w http.ResponseWriter, r *http.Request) {
	jsonResp, err := json.Marshal(s.db.Health())

	if err != nil {
		log.Fatalf("error handling JSON marshal. Err: %v", err)
	}

	_, _ = w.Write(jsonResp)
}

// type allowedTypes interface {
// 	*database.VotesJson | *database.ProposalsJson
// }

// type transformFn[T allowedTypes] func(T) T

// func callDatabase() {
