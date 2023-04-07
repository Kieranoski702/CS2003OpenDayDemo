.PHONY: data
data: data/TheBeatlesCleaned.json

data/TheBeatlesCleaned.json: data/interim/TheBeatlesCapitalised.csv
	node node/convert.js $< $@

# recapitalise all the things
data/interim/TheBeatlesCapitalised.csv: data/raw/TheBeatlesRaw.csv | data/interim
	./recapitalise $< > $@

.PHONY: clean
clean:
	rm -rf data/interim
	rm -rf data/TheBeatlesCleaned.json

data/interim:
	mkdir -p data/interim
