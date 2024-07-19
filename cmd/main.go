package main

import (
	"fmt"
	"go-lito/cmd/lito"

	_ "github.com/joho/godotenv/autoload"
)

func main() {
	// ** Used to start the http server **
	// server := server.NewServer()

	// err := server.ListenAndServe()
	// if err != nil {
	// 	panic(fmt.Sprintf("cannot start server: %s", err))
	// }
	lito := lito.Init()

	err := lito.Run()
	if err != nil {
		panic(fmt.Sprintf("Error running lito: %s", err))
	}
}
