develop: setup-git
	[ -f .env.development ] || cp .env.example .env.development
	pnpm install

setup-git:
ifneq (, $(shell which pre-commit))
	pre-commit install
endif
	git config branch.autosetuprebase always

test:
	pnpm test

preview-api-docs:
	bin/preview-api-docs
