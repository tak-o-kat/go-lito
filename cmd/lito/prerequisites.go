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

func Prerequisites() error {
	// Make sure OS is linux
	if runtime.GOOS != "linux" {
			return fmt.Errorf("this program is currently only supported on linux")
	}

	// Check if algod is running
	_, err := exec.Command("pgrep", "algod").Output()
	if err != nil {
		return fmt.Errorf("algod is not running")
	}

	// Make sure GOAL is installed
	if !commandExists("goal") {
			return fmt.Errorf("goal is not installed")
	}

	// Make sure ALGORAND_DATA is set
	_, isSet := os.LookupEnv("ALGORAND_DATA")
	if !isSet {
			return fmt.Errorf("ALGORAND_DATA env variable is not set")
	}

	return nil
}