develop:
	[ ! -f .env.develpoment ] && cp .env.example .env.development
	yarn

test:
	yarn test
