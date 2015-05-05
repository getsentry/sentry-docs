build: design/node_modules
	@cd design; ./node_modules/.bin/webpack
	@touch docs/index.rst
	@cd docs; make dirhtml html

watch: design/node_modules
	@cd design; ./node_modules/.bin/webpack --watch

design/node_modules:
	@cd design; npm install .
