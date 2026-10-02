develop: setup-git
	[ -f .env.development ] || cp .env.example .env.development
	pnpm install
	npx -y @sentry/dotagents install

setup-git:
ifneq (, $(shell which prek))
	prek install
endif
	git config branch.autosetuprebase always

test:
	pnpm test

preview-api-docs:
	bin/preview-api-docs

clean:
	rm -rf node_modules .next
