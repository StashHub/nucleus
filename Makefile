profile ?= nucleus
env ?= dev

# Check if SSO is configured for the target environment
sso-configured := $(shell aws configure get sso_session --profile $(profile)-$(env) > /dev/null && echo 'true' || echo 'false')

.DEFAULT_GOAL := help

.PHONY: login configure-sso dev seed migration studio help

# executed only if SSO is not configured for the target environment
configure-sso:
ifeq ($(sso-configured), false)
	@echo "Configure AWS SSO"
	aws configure sso --profile $(profile)-$(env)
endif

login: configure-sso
	@SSO_ACCOUNT=$$(aws sts get-caller-identity --query "Account" --profile $(profile)-$(env) 2>/dev/null); \
	if [ -z "$$SSO_ACCOUNT" ]; then \
		echo "Session expired. Logging in..."; \
		aws sso login --profile $(profile)-$(env); \
	else \
		echo "Session still valid. Continuing..."; \
	fi

dev: login
	@pnpm run dev

seed:
	@pnpm db:seed

migration:
	@pnpm db:migrate

studio:
	@pnpm db:studio

help:
	@echo "Usage: make <target> profile=<profile> env=<environment (dev,qa,prod)>"
	@echo "Targets:"
	@echo "  login        Log in using AWS SSO"
	@echo "  dev          Run development server"
	@echo "  seed         Run database seed"
	@echo "  migration    Run database migration"
	@echo "  studio       Open Prisma Studio"
