# Simple Makefile for a Go project
BINARY_NAME=lito

# Compile flags
GCFLAGS=-gcflags="all=-trimpath=$(CURDIR)" -asmflags="all=-trimpath=$(CURDIR)"

VERSION?=v0.1.4

# Build the application
all: build

build:
	@echo "Building..."
	
	
	@go build $(GCFLAGS) -o $(BINARY_NAME)

# Run the application
run:
	@go run main.go daemon -s

daemon:
	@go run main.go daemon

server:
	@go run main.go server

# Test the application
test:
	@echo "Testing..."
	@go test ./tests -v

# Clean the binary
clean:
	@echo "Cleaning..."
	@rm -f litod

# Live Reload
watch:
	@if command -v air > /dev/null; then \
	    air; \
	    echo "Watching...";\
	else \
	    read -p "Go's 'air' is not installed on your machine. Do you want to install it? [Y/n] " choice; \
	    if [ "$$choice" != "n" ] && [ "$$choice" != "N" ]; then \
	        go install github.com/air-verse/air@latest; \
	        air; \
	        echo "Watching...";\
	    else \
	        echo "You chose not to install air. Exiting..."; \
	        exit 1; \
	    fi; \
	fi

.PHONY: all build run test clean
