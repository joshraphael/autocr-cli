SHELL := /bin/bash

update:
	bash scripts/update.sh

test: test-18190

test-18190:
	node index.js --notes tests/18190/18190-Notes.json --user tests/18190/18190-User.txt --rich tests/18190/18190-User.txt --report