package cmd

import (
	"fmt"
	"go-lito/cmd/lito"
	"go-lito/internal/misc"
	"go-lito/internal/server"
	"os"
	"path/filepath"
	"strconv"

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
	daemonCmd.Flags().StringP("litofolder", "t", "lito", "name of the lito folder, used to store lito data")
	daemonCmd.Flags().StringP("database", "d", "golito.db", "database file")
	daemonCmd.Flags().StringP("logfile", "f", "node.archive.log", "archive log file from algod")
	daemonCmd.Flags().StringP("output", "o", "lito.log", "file to store lito logs")
	daemonCmd.Flags().StringP("loglevel", "l", "info", "set log level")
	daemonCmd.Flags().StringP("account", "a", "", "set participation account")
	daemonCmd.Flags().IntP("port", "p", 8081, "set server port")
	daemonCmd.Flags().BoolP("server", "s", true, "start api server along with daemon")
}

func daemon(cmd *cobra.Command, args []string) {
	envVar, _ := cmd.Flags().GetString("envvar")
	litoPath, _ := cmd.Flags().GetString("litofolder")
	database, _ := cmd.Flags().GetString("database")
	logFile, _ := cmd.Flags().GetString("logfile")
	output, _ := cmd.Flags().GetString("output")
	loglevel, _ := cmd.Flags().GetString("loglevel")
	account, _ := cmd.Flags().GetString("account")
	port, _ := cmd.Flags().GetInt("port")
	isServer, _ := cmd.Flags().GetBool("server")

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
	cfg.Port = strconv.Itoa(port)

	logger := misc.NewLogger(cfg.LitoPath, output)
	misc.LoadEnvSettings(logger)

	// initialize lito
	lito := lito.Init(logger, cfg)

	// determine if server will also run along with daemon
	if isServer {
		go func() {
			err := lito.Run()
			if err != nil {
				logger.Error().Msg(fmt.Sprintf("%s", err))
			}
		}()
		// start api server
		server := server.NewServer(logger, cfg)

		err := server.ListenAndServe()
		if err != nil {
			panic(fmt.Sprintf("cannot start server: %s", err))
		}
	} else {
		err := lito.Run()
		if err != nil {
			logger.Error().Msg(fmt.Sprintf("%s", err))
		}
	}

}
