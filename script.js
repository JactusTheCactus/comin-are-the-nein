#!/usr/bin/env node
import fs from "fs"
import YAML from "js-yaml"
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
				? [
					parentKey,
					key
				].join(".")
				: key
			const val = obj[key]
			if (Array.isArray(val)) {
				res[propName] = val.join(" ")
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
	const csv = [headers.join(',')]
		.concat(items.map(item => headers.map(h => {
			return (
				(
					/(?:,|^$)/.test(item[h])
					? `"${item[h]}"`
					: item[h]
				).replace(/"/g,"\"\"")
			) ?? ''
		}).join(',')))
		.join('\n')
	return csv
}
function clean(obj) {
	if (typeof obj === "object" && obj !== null && !Array.isArray(obj)) {
		Object.keys(obj).forEach(k => {
			if (/^_+/.test(k)) {
				delete obj[k]
			} else {
				clean(obj[k])
			}
		})
	}
	return obj
}
const heroes = clean(YAML.load(fs.readFileSync("data.yml")))
Object.keys(heroes).forEach(h => {
	const hero = heroes[h]
	delete hero.details
	heroes[capitalize(h)] = hero
	delete heroes[h]
})
const csv = jsonToCsv(heroes)
fs.writeFileSync("heroes.csv", csv)