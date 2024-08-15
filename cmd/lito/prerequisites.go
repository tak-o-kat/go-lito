package lito

import (
	"fmt"
	"os"
	"os/exec"
	"runtime"
	"strings"
)

func commandExists(cmd string) bool {
	_, err := exec.LookPath(cmd)
	return err == nil
}

func GetDataFolderInfo(command string) (string, error) {
	cmd := command
	stdout, err := exec.Command("bash", "-c", cmd).Output()

	if err != nil {
		return "", fmt.Errorf("error getting data folder info. Err: %v", err)
	}
	return strings.TrimSuffix(string(stdout), "\n"), nil
}

func CheckEnvVar(envVar string) error {
	_, isSet := os.LookupEnv(envVar)
	if !isSet {
		return fmt.Errorf("%s env variable is not set", envVar)
	}
	return nil
}

func Prerequisites(algod *AlgodInfo, cfg *Config) error {
	// Make sure OS is linux
	if runtime.GOOS != "linux" {
		return fmt.Errorf("this program is currently only supported on linux")
	}

	// Make sure GOAL is installed
	if !commandExists("goal") {
		return fmt.Errorf("goal is not installed")
	}

	// Make sure ALGORAND_DATA is set
	err := CheckEnvVar(cfg.EnvVar)
	if err != nil {
		return err
	}

	// Check if algod is running
	_, err = exec.Command("pgrep", "algod").Output()
	if err != nil {
		return fmt.Errorf("algod is not running")
	}

	// Now that algod and ALGORAND_DATA are checked, chekc NET and TOKEN
	cmd := "cat $" + cfg.EnvVar + "/algod.net"
	algod.url, err = GetDataFolderInfo(cmd)
	if err != nil {
		return err
	}

	cmd = "cat $" + cfg.EnvVar + "/algod.token"
	algod.token, err = GetDataFolderInfo(cmd)
	if err != nil {
		return err
	}
	// Get the part account
	var account string
	if cfg.Account != "" {
		account = cfg.Account
	} else {
		// if no account was passed in by the config, check .env file
		var isSet bool
		account, isSet = os.LookupEnv("ACCOUNT")
		if !isSet || account == "" {
			// if no .env file found or ACCOUNT env variable not set
			// extract the account using goal
			account, err = GetAccountAddress()
			if err != nil {
				return err
			}
		}
	}

	algod.PartAccount = account
	return nil
}
