SPHINX_BUILD=sphinx-build -v -a -d build/doctrees -T
SPHINX_HTML_BUILD=$(SPHINX_BUILD) -b sentryhtml
SPHINX_DIRHTML_BUILD=$(SPHINX_BUILD) -b sentrydirhtml

requirements: update-submodules
	@echo "--> Installing base requirements"
	@pip install awscli sphinx
	@echo ""

build: design/node_modules
	@echo "--> Prepairing theme"
	@cd design; ./node_modules/.bin/webpack
	@echo '--> Hosted Docs'
	@SENTRY_DOC_VARIANT=hosted $(SPHINX_HTML_BUILD) docs build/html/hosted
	@SENTRY_DOC_VARIANT=hosted $(SPHINX_DIRHTML_BUILD) docs build/dirhtml/hosted
	@echo '--> On-Premise Docs'
	@SENTRY_DOC_VARIANT=onpremise $(SPHINX_HTML_BUILD) docs build/html/on-premise
	@SENTRY_DOC_VARIANT=onpremise $(SPHINX_DIRHTML_BUILD) docs build/dirhtml/on-premise
	@echo ""

clean:
	@echo "--> Cleaning build"
	@rm -vrf build
	@echo ""

sync:
	@echo "--> Syncing with S3"
	@aws s3 sync --delete build/dirhtml/ s3://getsentry-docs/
	@echo ""

watch: design/node_modules
	@echo "--> Watching webpack"
	@cd design; ./node_modules/.bin/webpack --watch

design/node_modules: design/webpack.config.js design/package.json
	@echo "--> Installing frontend requirements"
	@cd design; npm install .
	@echo ""

update-submodules:
	@echo "--> Updating git submodules"
	git submodule init
	git submodule update
	@echo ""

release: requirements build sync

.PHONY: build requirements clean sync watch update-submodules
