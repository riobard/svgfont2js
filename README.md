# svgfont2js

Parse SVG font glyphs into JSON objects with normalized coordinates. The
resulting path data can be used directly in SVG documents or HTML5 canvas API to
draw glyphs.



## Installation

```sh
npm install svgfont2js
```


## Usage


```JavaScript
var fs = require("fs");
var svgfont2js = require("svgfont2js");

console.log(svgfont2js(fs.readFileSync("font.svg", "utf8")));
```


## Build

Transpile the source code (written in ES6) to ES5 for distribution.

```sh
npm run build
```
