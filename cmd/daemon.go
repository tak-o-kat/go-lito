package cmd

import (
	"fmt"
	"go-lito/cmd/lito"
	"go-lito/internal/misc"
	"os"
	"path/filepath"

	"github.com/spf13/cobra"
)

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

	daemonCmd.Flags().StringP("envvar", "e", "ALGORAND_DATA", "algod data environment variable")
	daemonCmd.Flags().StringP("path", "p", "lito", "path to lito folder")
	daemonCmd.Flags().StringP("database", "d", "golito.db", "database file")
	daemonCmd.Flags().StringP("logfile", "l", "node.archive.log", "archive log file from algod")
	daemonCmd.Flags().StringP("output", "o", "lito.log", "file to store lito logs")
	daemonCmd.Flags().StringP("loglevel", "s", "info", "set log level")
	daemonCmd.Flags().StringP("account", "a", "", "set participation account")
}

func daemon(cmd *cobra.Command, args []string) {
	envVar, _ := cmd.Flags().GetString("envvar")
	litoPath, _ := cmd.Flags().GetString("path")
	database, _ := cmd.Flags().GetString("database")
	logFile, _ := cmd.Flags().GetString("logfile")
	output, _ := cmd.Flags().GetString("output")
	loglevel, _ := cmd.Flags().GetString("loglevel")
	account, _ := cmd.Flags().GetString("account")

	// extract path from env variable
	envPath := os.Getenv(envVar)

	cfg := new(lito.Config)
	cfg.EnvVar = envVar
	cfg.LitoPath = filepath.Join(envPath, litoPath)
	cfg.Database = database
	cfg.LogFile = logFile
	cfg.Output = output
	cfg.Loglevel = loglevel
	cfg.Account = account

	logger := misc.NewLogger(cfg.LitoPath, output)
	misc.LoadEnvSettings(logger)

	lito := lito.Init(logger, cfg)

	err := lito.Run()
	if err != nil {
		logger.Error().Msg(fmt.Sprintf("%s", err))
	}
}
