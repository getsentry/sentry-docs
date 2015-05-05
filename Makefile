build: design/node_modules
	@cd design; ./node_modules/.bin/webpack
	@touch docs/index.rst
	@cd docs; make dirhtml html

clean:
	@cd docs; make clean

watch: design/node_modules
	@cd design; ./node_modules/.bin/webpack --watch

design/node_modules:
	@cd design; npm install .
