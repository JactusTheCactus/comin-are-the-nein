#!/usr/bin/env node
import { fs, YAML } from "./packages.js"
function capitalize(str, strict = false) {
	return [
		str[0].toUpperCase(),
		strict
			? str.slice(1).toLowerCase()
			: str.slice(1)
	].join("")
}
function jsonToCsv(obj) {
	function flatten(obj, parentKey = '', res = {}) {
		for (let key in obj) {
			const propName = parentKey
				? `${parentKey}[${key}]`
				: key
			const val = obj[key]
			if (Array.isArray(val)) {
				res[propName] = val.join({
					extra: ", ",
					name: " ",
					species: " | "
				}[key] ?? "_")
			} else if (val && typeof val === "object") {
				flatten(val, propName, res)
			} else {
				res[propName] = val
			}
		}
		return res
	}
	const items = Object.entries(obj).map(([key, val]) => ({
		key, ...flatten(val)
	}))
	const headers = Object.keys(items[0])
	const delimiter = ","
	const csv = [
		headers
			.map(k => k.replace(
				/^key$/,
				"moniker"
			)).join(delimiter)
	]
		.concat(items.map(item => headers.map(h => {
			return String(item[h] ?? "")
				.trim()
				.replace(/"/g, `""`)
				.replace(/^[\S\s]+$/,m => /[,"]/
					.test(m)
						? `"${m}"`
						: m
				)
		}).join(delimiter)))
		.join('\n')
	return csv
}
function clean(obj) {
	if (typeof obj === "object" && obj !== null && !Array.isArray(obj)) {
		Object.keys(obj).forEach(k => {
			if (/^_+|_+$/.test(k)) {
				delete obj[k]
			} else {
				if (Array.isArray(obj[k])) {
					clean(obj[k])
				}
			}
		})
	}
	return obj
}
const heroes = clean(YAML.load(fs.readFileSync("data/.yml")))
Object.keys(heroes).forEach(h => {
	const hero = heroes[h]
	delete hero.details
	heroes[capitalize(h)] = hero
	delete heroes[h]
})
const csv = jsonToCsv(heroes)
fs.writeFileSync("data/.csv", csv)