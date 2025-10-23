#!/usr/bin/env node
import { fs, YAML } from "./packages.js"
const pack = JSON.parse(fs.readFileSync("./package.json"))
const scripts = YAML.load(fs.readFileSync("./scripts.yml"))
pack.scripts = {}
Object.keys(scripts)
	.forEach(k => {
		[
			pack.scripts[k],
			pack.scripts[k[0]]
		] = Array.from({
			length: 2
		}, () => [
			`echo "${k.toUpperCase()}"`,
			scripts[k]
		].join("\n"))
	})
fs.writeFileSync("package.json",
	JSON.stringify(
		Object.keys(pack)
			.sort()
			.reduce((acc,key) => {
				acc[key] = pack[key]
				return acc
			},{}),
		null,
		"\t"
	)
		.replace(/ {2}/g, "\\t")
)