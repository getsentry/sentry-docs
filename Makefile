develop:
	[ ! -f .env.develpoment ] && cp .env.example .env.development
	yarn develop

test:
	yarn test
