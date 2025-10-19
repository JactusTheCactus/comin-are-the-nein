#!/usr/bin/env node
import fs from "fs"
import yaml from "js-yaml"
let out = []
function capitalize(text) {
	return text[0].toUpperCase() + text.slice(1).toLowerCase()
}
const heroes = yaml.load(fs.readFileSync("data.yml", {
	encoding: "utf8"
}))
Object.entries(heroes).forEach(([n, t]) => {
	out.push(`# ${capitalize(n)}\n`)
	out.push(t.replace(/\n/g, "\\\n"))
})
fs.writeFileSync("README.md",
	out.join("\n")
		.replace(/\\(\n{2,}|$)/g, "$1")
		.replace(/\n+/g, "\n")
		.replace(/^\n+|\n+$/g, "")
		.replace(/\\$/g, "")
)