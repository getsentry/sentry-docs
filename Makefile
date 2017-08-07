SPHINX_BUILD=PYTHONIOENCODING=utf-8 SENTRY_FEDERATED_DOCS=1 venv/bin/sphinx-build -v -d build/doctrees -T -W
SPHINX_HTML_BUILD=$(SPHINX_BUILD) -b sentryhtml
SPHINX_DIRHTML_BUILD=$(SPHINX_BUILD) -b sentrydirhtml

setup: venv/bin/python requirements

venv/bin/python:
	@echo "--> Creating Virtualenv"
	@virtualenv venv

requirements: update-submodules venv/bin/python
	@echo "--> Installing base requirements"
	@venv/bin/pip install "pip>=8.1.1"
	@venv/bin/pip install --upgrade awscli sphinx==1.3.4 docutils==0.13.1 click virtualenv
	@echo ""

build-only: design/node_modules
	@echo "--> Preparing theme"
	@mkdir -p build/theme/sentry
	@cp -R design/theme-support/* build/theme/sentry
	@cp -R design/templates/* build/theme/sentry
	@cd design && ./node_modules/.bin/webpack -p
	@echo '--> Building'
	@SENTRY_DOC_VARIANT=hosted $(SPHINX_HTML_BUILD) -a docs build/html
	@SENTRY_DOC_VARIANT=hosted $(SPHINX_DIRHTML_BUILD) -a docs build/dirhtml
	@echo ""

fast-build:
	@echo '--> Building (fast)'
	@SENTRY_DOC_VARIANT=hosted $(SPHINX_HTML_BUILD) -j 8 docs build/html

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
	cd build/html/ && rm -rf _static && ln -Ffshv ../theme/sentry/static _static

.PHONY: build requirements clean sync watch update-submodules
