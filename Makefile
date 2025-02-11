develop:
	npx webpack serve

install:
	npm ci

build:
	NODE_ENV=production npx webpack

# build:
#  export NODE_ENV=production && npx webpack

test:
	npm test

lint:
	npx eslint .

.PHONY: test
# .PHONY: test install build develop lint
