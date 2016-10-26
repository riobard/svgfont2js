"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var XMLParser = require("xml2js").Parser;

var SVGPath = _interopRequire(require("svgpath"));

module.exports = function (xml) {
  var glyphs = [];

  new XMLParser({ async: false }).parseString(xml, function (err, root) {
    if (err) {
      throw err;
    }

    // Read http://www.w3.org/TR/SVG/fonts.html for SVG font spec
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = root.svg.defs[0].font[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var font = _step.value;

        var face = font["font-face"][0];
        var em = +face.$["units-per-em"] || 1000; // size of the em square
        var ascent = +face.$.ascent; // unaccented height of font above x-axis
        var hox = +font.$["horiz-origin-x"] || 0; // x origin of font coordinates
        var hoy = +font.$["horiz-origin-y"] || 0; // y origin of font coordinates
        var hdx = +font.$["horiz-adv-x"] || em; // width of glyph
        var vdy = +font.$["vert-adv-y"] || em; // height of glyph

        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = font.glyph[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var g = _step2.value;

            if (!g.$.d || !g.$.unicode) {
              continue;
            } // skip empty glyph without path data

            var path = new SVGPath(g.$.d).translate(-hox, -hoy) // move to origin (0, 0) in font coordinates
            .translate(0, -ascent) // move below x-axis
            .scale(1, -1) // invert y-axis (font coordinates -> initial coordinates)
            .round(1).toString();

            glyphs.push({
              font_id: font.$.id,
              font_family: face.$["font-family"],
              name: g.$["glyph-name"],
              unicode: g.$.unicode,
              unicode_hex: g.$.unicode.charCodeAt(0).toString(16),
              path: path,
              width: +g.$["horiz-adv-x"] || hdx,
              height: +g.$["vert-adv-y"] || vdy });
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2["return"]) {
              _iterator2["return"]();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator["return"]) {
          _iterator["return"]();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  });

  return glyphs;
};

