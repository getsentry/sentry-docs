requirements: update-submodules
	@echo "--> Installing base requirements"
	@pip install awscli sphinx
	@echo ""

build: design/node_modules
	@echo "--> Prepairing theme"
	@cd design; ./node_modules/.bin/webpack
	@echo '--> Cloud Docs'
	@SENTRY_DOC_VARIANT=cloud sphinx-build -v -a -b sentryhtml -d build/doctrees -T docs build/html/cloud
	@SENTRY_DOC_VARIANT=cloud sphinx-build -v -a -b sentrydirhtml -d build/doctrees -T docs build/dirhtml/cloud
	@echo '--> Enterprise Docs'
	@SENTRY_DOC_VARIANT=enterprise sphinx-build -v -a -b sentryhtml -d build/doctrees -T docs build/html/enterprise
	@SENTRY_DOC_VARIANT=enterprise sphinx-build -v -a -b sentrydirhtml -d build/doctrees -T docs build/dirhtml/enterprise
	@echo '--> Community Docs'
	@SENTRY_DOC_VARIANT=community sphinx-build -v -a -b sentryhtml -d build/doctrees -T docs build/html/community
	@SENTRY_DOC_VARIANT=community sphinx-build -v -a -b sentrydirhtml -d build/doctrees -T docs build/dirhtml/community
	@echo ""

clean:
	@rm -rf build

sync:
	@echo "--> Syncing with S3"
	@aws s3 sync --delete docs/build/dirhtml/ s3://getsentry-docs/
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
