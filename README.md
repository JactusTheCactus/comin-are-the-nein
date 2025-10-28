# Commands
## Build
```npm
npm run build
```
Builds `data/.csv` from `data/.yml`
## Page
```npm
npm run page
```
Builds the webpage (`index.html`) + stylesheet (`page/_.css`)
## Post
```npm
npm run post
```
Removes unnecessary files (`*.map`)
## Sync
```npm
npm run sync
```
Syncs up the `scripts` in `package.json` with `scripts.yml`
## Watch
```npm
npm run watch
```
Watches changes to `data/.yml` and rebuilds `data/.csv`. (Like [`npm run build`](#build), but continuous)