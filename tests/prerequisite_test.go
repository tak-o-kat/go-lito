package tests

import (
	"errors"
	"fmt"
	"go-lito/cmd/lito"
	"os/exec"
	"testing"
)

func TestGoalRunning(t *testing.T) {
	// Shutdown algod before running these tests
	cmd := "goal node stop"
	_ = exec.Command("bash", "-c", cmd).Run()

	// Ensure algod is not running when running these tests
	expected := "Algorand node successfully started!\n"

	cmd = "goal node start"
	got, _ := exec.Command("bash", "-c", cmd).Output()

	if expected != string(got) {
		t.Errorf("expected %v; got %v", expected, string(got))
	}
}

func TestGoalNotRunning(t *testing.T) {
	cmd := "goal node stop"
	err := exec.Command("bash", "-c", cmd).Run()

	if err != nil {
		fmt.Printf("%s", err)
	}

	expected := errors.New("algod is not running")

	var algod lito.AlgodInfo
	got := lito.Prerequisites(&algod)

	if expected.Error() != got.Error() {
		t.Errorf("expected %v; got %v", expected, got)
	}
}

func TestAlgorandDataFolder(t *testing.T) {
	start := "goal node start"
	exec.Command("bash", "-c", start).Run()

	expected := "127.0.0.1:8080"
	got, _ := lito.GetDataFolderInfo("cat $ALGORAND_DATA/algod.net")

	if expected != got {
		t.Errorf("expected %v; got %v", expected, got)
	}

	token, _ := lito.GetDataFolderInfo("cat $ALGORAND_DATA/algod.net")
	
	if token == "" {
		t.Errorf("expected token to exist; got %v", token)
	}
	// Stop algod
	stop := "goal node stop"
	exec.Command("bash", "-c", stop).Run()
}

