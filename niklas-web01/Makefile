ifeq ($(shell uname),Darwin) 
OPEN_CMD = open
else
OPEN_CMD = xdg-open
endif

.PHONY: json
json: www/data/TheBeatlesCleaned.json

www/data/TheBeatlesCleaned.json: www/data/TheBeatlesCleaned.csv www/convert.js
	cd www;node convert.js data/TheBeatlesCleaned.csv

.PHONY: dev
dev:
	npm ci

.PHONY: local
local: www/data/TheBeatlesCleaned.json
	cd www; python3 -m http.server 8000 

.PHONY: staging
staging: www/data/TheBeatlesCleaned.json
	scp -r www/* palain:/cs/home/nd60/nginx_default/staging

.PHONY: docs
docs:
	npx jsdoc -c jsdoc-conf.json www/**/*.js www/main.js -d ./docs

.PHONY: clean clean-dev
clean: 
	rm -rf docs
	rm -rf www/data/TheBeatlesCleaned.json

clean-dev: clean
	rm -rf node_modules

.PHONY: package
package:
	cd report;make pdf
	cp report/output/report.pdf ./report.pdf
	zip -ru submission.zip www Makefile README report.pdf .eslintrc.js .stylelintrc.json .vscode jsdoc-conf.json package-lock.json package.json specification.html
