develop:
	[ ! -f gatsby/.env.develpoment ] && cp gatsby/.env.example gatsby/.env.development
	yarn develop

test:
	yarn test
