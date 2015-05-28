requirements:
	@pip install awscli sphinx

build: design/node_modules
	@cd design; ./node_modules/.bin/webpack
	@touch docs/index.rst
	@cd docs; make dirhtml html

clean:
	@cd docs; make clean

sync:
	@aws s3 sync --delete docs/_build/dirhtml/ s3://getsentry-docs/

watch: design/node_modules
	@cd design; ./node_modules/.bin/webpack --watch

design/node_modules:
	@cd design; npm install .

release: requirements build sync
