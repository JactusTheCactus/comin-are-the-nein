#!/usr/bin/env bash
set -euo pipefail
flag() {
	for f in "$@"; do
		[[ -e ".flags/$f" ]] || return 1
	done
}
npm run sync
if flag local; then
	npm run watch
else
	npm run build
fi