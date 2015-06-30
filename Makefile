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
	@echo '--> Cloud Docs'
	@SENTRY_DOC_VARIANT=hosted $(SPHINX_HTML_BUILD) docs build/html/hosted
	@SENTRY_DOC_VARIANT=hosted $(SPHINX_DIRHTML_BUILD) docs build/dirhtml/hosted
	@echo '--> Enterprise Docs'
	@SENTRY_DOC_VARIANT=enterprise $(SPHINX_HTML_BUILD) docs build/html/enterprise
	@SENTRY_DOC_VARIANT=enterprise $(SPHINX_DIRHTML_BUILD) docs build/dirhtml/enterprise
	@echo '--> Community Docs'
	@SENTRY_DOC_VARIANT=community $(SPHINX_HTML_BUILD) docs build/html/community
	@SENTRY_DOC_VARIANT=community $(SPHINX_DIRHTML_BUILD) docs build/dirhtml/community
	@echo ""

clean:
	@echo "--> Cleaning build"
	@rm -vrf build
	@echo ""

sync:
	@echo "--> Syncing with S3"
	@aws s3 sync --delete docs/build/dirhtml/ s3://getsentry-docs/
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
