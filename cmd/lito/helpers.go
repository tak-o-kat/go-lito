package lito

import (
	"errors"
	"fmt"
	"os"
	"os/exec"
	"strings"
)

func Exists(name string) (bool, error) {
	_, err := os.Stat(name)
	if err == nil {
			return true, nil
	}
	if errors.Is(err, os.ErrNotExist) {
			return false, nil
	}
	return false, err
}

func GetAccountAddress() (string, error) {
	cmd := "goal account partkeyinfo | " +
			"sed -n '/Parent/p' | " +
			"awk '{print $3}'"
	stdout, err := exec.Command("bash", "-c", cmd).Output()

	if err != nil {
		return "", fmt.Errorf("%s", err)
	}
	return strings.TrimSuffix(string(stdout), "\n"), nil
}
