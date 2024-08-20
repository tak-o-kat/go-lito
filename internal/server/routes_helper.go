package server

import (
	"fmt"
	"strconv"
	"strings"
	"time"
)

const UPPER_NUM_LIMIT = 10000
const MAX_TYPE_ID = 5

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

	if id > MAX_TYPE_ID {
		return 0, fmt.Errorf("id value must be less than or equal to %d", MAX_TYPE_ID)
	}

	return id, nil
}

func sanitizeSort(order string) (string, error) {
	if order == "" {
		return "asc", nil
	}

	if strings.ToLower(order) != "asc" && strings.ToLower(order) != "desc" {
		return "", fmt.Errorf("invalid order value")
	}

	return order, nil
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

func (s *Server) sanitizeTimeStampRange(from string, to string) (Range, error) {
	fromParam, err := sanitizeTime(from)
	if err != nil {
		s.logger.Error().Msgf("error handling %v", err)
		return Range{}, err
	}

	minTimeStamp, err := s.db.GetMinTimeStamp()
	if err != nil {
		return Range{}, err
	}
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
