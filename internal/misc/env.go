package misc

import (
	"errors"

	"os"

	"github.com/joho/godotenv"
	"github.com/rs/zerolog"
)

func LoadEnvSettings(log *zerolog.Logger) {
	loadEnvFile(log, "../../.env.local")
	loadEnvFile(log, "../../.env")
}

func loadEnvFile(log *zerolog.Logger, filename string) {
	err := godotenv.Load(filename)
	if !errors.Is(err, os.ErrNotExist) {
		log.Warn().Msgf("error loading %s, err: %v", filename, err)
	}
}