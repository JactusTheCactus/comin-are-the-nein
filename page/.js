#!/usr/bin/env node
import { fs, pug } from "./../packages.js"
fs.writeFileSync(
	"./index.html",
	pug.renderFile("./page/.pug")
)