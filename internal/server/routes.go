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
	s.logger.Info().Msg("Registering routes")
	r := httprouter.New()

	r.HandlerFunc(http.MethodGet, "/health", s.healthHandler)
	r.HandlerFunc(http.MethodGet, "/test", s.TestHandler)

	// Routes for /api/totals
	r.HandlerFunc(http.MethodGet, "/api/totals/", s.TotalsHandler)
	r.GET("/api/totalid/:id", s.TotalsIdHandler)

	// TODO: Add routes for /api/votes and /api/votes/:id
	r.GET("/api/votes/limit/:limit/:order", s.votesHandler)           // returns num votes asc by limit
	r.GET("/api/votes/typeid/:id/:limit/:order", s.voteTypeIdHandler) // return votes by type (SOFT or CERT) asc
	r.GET("/api/voteid/:id", s.voteIdHandler)                         // return 1 vote by it's id

	// ex. /api/votes/from/{timestamp}/to/{timestamp}
	r.GET("/api/votes/from/:from/to/:to", s.votesDateRangeHandler)

	// ex. /api/votes?from={timestamp}&to={timestamp}&limit={number}&order={asc|desc}
	r.HandlerFunc(http.MethodGet, "/api/votes/range", s.votesDateRangeParamHandler)

	// Add routes for proposals and onchain

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
