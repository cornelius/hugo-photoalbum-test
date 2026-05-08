.DEFAULT_GOAL := help
.PHONY: help update build serve clean

help: ## Show available targets
	@awk 'BEGIN {FS = ":.*##"} /^[a-zA-Z_-]+:.*##/ { printf "  %-10s %s\n", $$1, $$2 }' $(MAKEFILE_LIST)

update: ## Update the theme module to its latest commit
	hugo mod get -u
	hugo mod tidy

build: ## Build the test album
	hugo

serve: ## Run the dev server
	hugo server

clean: ## Remove generated output
	rm -rf public resources
