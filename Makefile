requirements: update-submodules
	@echo "--> Installing base requirements"
	@pip install awscli sphinx
	@echo ""

build: design/node_modules
	@echo "--> Building docs"
	@cd design; ./node_modules/.bin/webpack
	@touch docs/index.rst
	@cd docs; make dirhtml html
	@echo ""

clean:
	@cd docs; make clean

sync:
	@echo "--> Syncing with S3"
	@aws s3 sync --delete docs/_build/dirhtml/ s3://getsentry-docs/
	@echo ""

watch: design/node_modules
	@cd design; ./node_modules/.bin/webpack --watch

design/node_modules:
	@echo "--> Installing frontend requirements"
	@cd design; npm install .
	@echo ""

update-submodules:
	@echo "--> Updating git submodules"
	git submodule init
	git submodule update
	@echo ""

release: requirements build sync
