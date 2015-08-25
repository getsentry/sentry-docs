SPHINX_BUILD=SENTRY_FEDERATED_DOCS=1 sphinx-build -v -a -d build/doctrees -T -j 16
SPHINX_HTML_BUILD=$(SPHINX_BUILD) -b sentryhtml
SPHINX_DIRHTML_BUILD=$(SPHINX_BUILD) -b sentrydirhtml

requirements: update-submodules
	@echo "--> Installing base requirements"
	@pip install awscli sphinx click
	@echo ""

build: design/node_modules generate-api-docs
	@echo "--> Prepairing theme"
	@mkdir -p build/theme/sentry
	@cp -R design/theme-support/* build/theme/sentry
	@cp -R design/templates/* build/theme/sentry
	@cd design && ./node_modules/.bin/webpack -p
	@echo '--> Hosted Docs'
	@SENTRY_DOC_VARIANT=hosted $(SPHINX_HTML_BUILD) docs build/html/hosted
	@SENTRY_DOC_VARIANT=hosted $(SPHINX_DIRHTML_BUILD) docs build/dirhtml/hosted
	@echo '--> On-Premise Docs'
	@SENTRY_DOC_VARIANT=on-premise $(SPHINX_HTML_BUILD) docs build/html/on-premise
	@SENTRY_DOC_VARIANT=on-premise $(SPHINX_DIRHTML_BUILD) docs build/dirhtml/on-premise
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
	git submodule update --init
	@echo ""

generate-api-docs:
	@echo "--> Generate API documentation"
	@python bin/generate-api-docs.py

release: requirements build sync

.PHONY: build requirements clean sync watch update-submodules
