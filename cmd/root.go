/*
Copyright © 2024 TakokaT Nobuyuki

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
*/
package cmd

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"
)

type VersionInfo struct {
	Version   string
	BuildDate string
	GitCommit string
}

var Version = VersionInfo{
	Version:   "",
	BuildDate: "",
	GitCommit: "",
}

// rootCmd represents the base command when called without any subcommands
var rootCmd = &cobra.Command{
	Use:   "lito",
	Short: "Algod persistent log tool suite",
	Long: `Allows an   Algorand node runner to use select tools to parse log data and store 
it in a sqlite database. Using these tools a user can get access to the database using
sqlite query tools, an API interface, a web dashboard, and finaly a terminal based CLI.`,
	// Uncomment the following line if your bare application
	// has an action associated with it:
	// Run: func(cmd *cobra.Command, args []string) { },
}

// Create the version command
var versionCmd = &cobra.Command{
	Use:   "version",
	Short: "Print version information",
	Run: func(cmd *cobra.Command, args []string) {
		// Print the version
		// fmt.Println("Lito version:", Version)
		printVersion(Version)
	},
}

func printVersion(v VersionInfo) {
	fmt.Printf("Version: %s\n", v.Version)
	// fmt.Printf("Build Date: %s\n", v.BuildDate)
	// fmt.Printf("Git Commit: %s\n", v.GitCommit)
}

// Execute adds all child commands to the root command and sets flags appropriately.
// This is called by main.main(). It only needs to happen once to the rootCmd.
func Execute(version string) {
	Version.Version = version
	err := rootCmd.Execute()
	if err != nil {
		os.Exit(1)
	}
}

func init() {
	// Here you will define your flags and configuration settings.
	// Cobra supports persistent flags, which, if defined here,
	// will be global for your application.

	// rootCmd.PersistentFlags().StringVar(&cfgFile, "config", "", "config file (default is $HOME/.cli.yaml)")

	// Add the version command
	rootCmd.AddCommand(versionCmd)

	// Cobra also supports local flags, which will only run
	// when this action is called directly.
	rootCmd.Flags().BoolP("toggle", "t", false, "Help message for toggle")
}
