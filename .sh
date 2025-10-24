#!/usr/bin/env bash
set -euo pipefail
flag() {
	for f in "$@"; do
		[[ -e ".flags/$f" ]] || return 1
	done
}
npm remove tomlify-j0.4
npm run s
if flag local; then
	npm run w
else
	npm run b
fi