package cmd

import (
	"fmt"
	"go-lito/cmd/lito"
	"go-lito/internal/misc"
	"os"
	"path/filepath"

	"github.com/spf13/cobra"
)

type config struct {
	envVar   string
	path     string
	database string
	output   string
	loglevel string
	port     int
}

var daemonCmd = &cobra.Command{
	Use:   "daemon",
	Short: "Start litod in daemon mode",
	Long: `Lito daemon is a tool used to save algod logs to a persistent database 
using sqlite. The database is created if it does not exist and if no 
options or flags are used the default settings will be used.`,

	Run: daemon,
}

func init() {
	rootCmd.AddCommand(daemonCmd)

	daemonCmd.Flags().StringP("envvar", "e", "ALGORAND_DATA", "Algod data environment variable")
	daemonCmd.Flags().StringP("path", "p", "lito", "Path to lito folder")
	daemonCmd.Flags().StringP("database", "d", "golito.db", "Database file")
	daemonCmd.Flags().StringP("output", "o", "lito.log", "File to store lito logs")
	daemonCmd.Flags().StringP("loglevel", "s", "local", "Set log level")
	// daemonCmd.Flags().StringP("env", "e", "local", "Set environment level")
}

func daemon(cmd *cobra.Command, args []string) {
	envVar, _ := cmd.Flags().GetString("envvar")
	path, _ := cmd.Flags().GetString("path")
	database, _ := cmd.Flags().GetString("database")
	output, _ := cmd.Flags().GetString("output")
	loglevel, _ := cmd.Flags().GetString("loglevel")
	// env, _ := cmd.Flags().GetBool("env")

	// extract path from env variable
	envPath := os.Getenv(envVar)

	cmdSettings := config{
		envVar:   envVar,
		path:     filepath.Join(envPath, path),
		database: database,
		output:   output,
		loglevel: loglevel,
	}
	_ = cmdSettings

	fmt.Println(cmdSettings.path)

	logger := misc.NewLogger(cmdSettings.path, output)
	misc.LoadEnvSettings(logger)

	// Use channel to inform the http server to continue running
	lito := lito.Init(logger)

	err := lito.Run()
	if err != nil {
		logger.Error().Msg(fmt.Sprintf("%s", err))
	}
}
