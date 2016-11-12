'use strict';

import {Parser as XMLParser} from 'xml2js';
import SVGPath from 'svgpath';


export default function(xml) {
  const glyphs = [];

  (new XMLParser({async: false})).parseString(xml, (err, root) => {
    if (err) { throw err; }

    // Read http://www.w3.org/TR/SVG/fonts.html for SVG font spec
    for (let font of root.svg.defs[0].font) {
      const face = font['font-face'][0];
      const em = +face.$['units-per-em'] || 1000; // size of the em square
      const ascent = +face.$['ascent'];           // unaccented height of font above x-axis
      const hox = +font.$['horiz-origin-x'] || 0; // x origin of font coordinates
      const hoy = +font.$['horiz-origin-y'] || 0; // y origin of font coordinates
      const hdx = +font.$['horiz-adv-x'] || em;   // width of glyph
      const vdy = +font.$['vert-adv-y'] || em;    // height of glyph

      for (let g of font.glyph) {
        if (!g.$.d || !g.$.unicode) { continue; } // skip empty glyph without path data

        const path = (new SVGPath(g.$.d))
          .translate(-hox, -hoy)  // move to origin (0, 0) in font coordinates
          .translate(0, -ascent)  // move below x-axis
          .scale(1, -1)           // invert y-axis (font coordinates -> initial coordinates)
          .round(1)
          .toString();

        glyphs.push({
          font_id: font.$.id,
          font_family: face.$['font-family'],
          name: g.$['glyph-name'],
          unicode: g.$.unicode,
          unicode_hex: g.$.unicode.charCodeAt(0).toString(16),
          path: path,
          width: +g.$['horiz-adv-x'] || hdx,
          height: +g.$['vert-adv-y'] || vdy,
        });
      }
    }
  });

  return glyphs;
}
