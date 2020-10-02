develop: setup-git
	[ -f .env.development ] || cp .env.example .env.development
	yarn

setup-git:
ifneq (, $(shell which pre-commit))
	pre-commit install
endif
	git config branch.autosetuprebase always

test:
	yarn test
