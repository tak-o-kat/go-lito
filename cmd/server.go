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

var serverCmd = &cobra.Command{
	Use:   "server",
	Short: "Start litod in server mode",
	Long: `Lito server is a service used to fetch algod log data from sqlite. 
It uses a RESTful API's to serve data using the JSON format.`,

	Run: serverCli,
}

func init() {
	rootCmd.AddCommand(serverCmd)

	serverCmd.Flags().StringP("envvar", "e", "ALGORAND_DATA", "algod data environment variable")
	serverCmd.Flags().StringP("litofolder", "t", "lito", "name of the lito folder, used to store lito data")
	serverCmd.Flags().StringP("database", "d", "golito.db", "database file")
	serverCmd.Flags().StringP("logfile", "f", "node.log", "current log file from algod")
	serverCmd.Flags().StringP("output", "o", "lito.log", "file to store lito logs")
	serverCmd.Flags().StringP("loglevel", "l", "info", "set log level")
	serverCmd.Flags().StringP("net", "n", "127.0.0.1", "set network interface")
	serverCmd.Flags().IntP("port", "p", 8081, "set server port")
}

func serverCli(cmd *cobra.Command, args []string) {
	envVar, _ := cmd.Flags().GetString("envvar")
	litoPath, _ := cmd.Flags().GetString("litofolder")
	database, _ := cmd.Flags().GetString("database")
	logFile, _ := cmd.Flags().GetString("logfile")
	output, _ := cmd.Flags().GetString("output")
	loglevel, _ := cmd.Flags().GetString("loglevel")
	netInterface, _ := cmd.Flags().GetString("net")
	port, _ := cmd.Flags().GetInt("port")

	// extract path from env variable
	envPath := os.Getenv(envVar)

	cfg := new(lito.Config)
	cfg.EnvVar = envVar
	cfg.LitoPath = filepath.Join(envPath, litoPath)
	cfg.Database = database
	cfg.LogFile = logFile
	cfg.Output = output
	cfg.Loglevel = loglevel
	cfg.NetInterface = netInterface
	cfg.Port = strconv.Itoa(port)

	logger := misc.NewLogger(cfg.LitoPath, output)
	misc.LoadEnvSettings(logger)

	server := server.NewServer(logger, cfg)

	err := server.ListenAndServe()
	if err != nil {
		panic(fmt.Sprintf("cannot start server: %s", err))
	}

}
