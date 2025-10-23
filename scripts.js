#!/usr/bin/env node
import { fs, YAML } from "./packages.js"
const pack = JSON.parse(fs.readFileSync("./package.json"))
const scripts = YAML.load(fs.readFileSync("./scripts.yml"))
Object.keys(scripts)
	.forEach(k => {
		[
			pack.scripts[k],
			pack.scripts[k[0]]
		] = Array.from({
			length: 2
		}, () => [
			k.toUpperCase(),
			scripts[k]
		].join("\n"))
	})
fs.writeFileSync("package.json",
	JSON.stringify(pack, null, "\t")
		.replace(/ {2}/g, "\\t")
)