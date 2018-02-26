build: directories
	tsc src/main.ts --outDir output/

run: build
	node output/main.js

output:
	mkdir output

directories: output

.PHONY: build
