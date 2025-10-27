#!/usr/bin/env node
import { fs, Mustache, YAML } from "./packages.js"
const template = fs.readFileSync("./data/.mustache")
const data = YAML.load("data.yml")
const output = Mustache.render(template, data)
fs.writeFileSync("./index.md",output)