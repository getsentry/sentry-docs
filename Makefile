SPHINX_BUILD=SENTRY_FEDERATED_DOCS=1 venv/bin/sphinx-build -v -a -d build/doctrees -T -j 1 -W
SPHINX_HTML_BUILD=$(SPHINX_BUILD) -b sentryhtml
SPHINX_DIRHTML_BUILD=$(SPHINX_BUILD) -b sentrydirhtml

venv/bin/python:
	@echo "--> Creating Virtualenv"
	@virtualenv venv

requirements: update-submodules venv/bin/python
	@echo "--> Installing base requirements"
	@venv/bin/pip install --upgrade pip
	@venv/bin/pip install awscli sphinx click virtualenv
	@echo ""

build-only: design/node_modules
	@echo "--> Preparing theme"
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
	@cp -R design/root-sitemap.xml build/html/sitemap.xml
	@echo ""

build: update-api-docs build-only

clean:
	@echo "--> Cleaning build"
	@rm -vrf build
	@echo ""

sync:
	@echo "--> Syncing with S3"
	@venv/bin/aws s3 sync --delete build/dirhtml/ s3://getsentry-docs/
	@./bin/upload-search-index
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

extract-docs:
	@echo "--> Update api-docs venv"
	./bin/extract-docs

generate-api-docs:
	@echo "--> Generate API documentation"
	./venv/bin/python ./bin/generate-api-docs

update-api-docs: extract-docs generate-api-docs

release: requirements build sync

serve:
	@./bin/web

link-static:
	cd build/html/hosted/ && rm -rf _static && ln -Ffshv ../../theme/sentry/static _static
	cd build/html/on-premise/ && rm -rf _static && ln -Ffshv ../../theme/sentry/static _static

.PHONY: build requirements clean sync watch update-submodules
