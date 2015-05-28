requirements:
	@echo "--> Installing base requirements"
	@pip install awscli sphinx

build: design/node_modules
	@echo "--> Building docs"
	@cd design; ./node_modules/.bin/webpack
	@touch docs/index.rst
	@cd docs; make dirhtml html

clean:
	@cd docs; make clean

sync:
	@echo "--> Syncing with S3"
	@aws s3 sync --delete docs/_build/dirhtml/ s3://getsentry-docs/

watch: design/node_modules
	@cd design; ./node_modules/.bin/webpack --watch

design/node_modules:
	@echo "--> Installing frontend requirements"
	@cd design; npm install .

release: requirements build sync
