/* global QUnit */

// Use "require" only if run from command line
if (typeof (require) !== 'undefined') {
  var DDtoWGS84 = require('../coords.js').DDtoWGS84;
  var WGS84toDD = require('../coords.js').WGS84toDD;
  var transformCoordinatesString = require('../coords.js').transformCoordinatesString;
}

QUnit.module('WGS84 <-> DD conversion');

QUnit.test('WGS84 -> DD convert', function (assert) {
  assert.equal(DDtoWGS84(32.23413, 24.39135), "N 32° 14.048', E 24° 23.481'");
});

QUnit.test('DD -> WGS84 convert', function (assert) {
  assert.equal(WGS84toDD('N', 32, 14.048, 'E', 24, 23.481), '32.23413, 24.39135');
});


QUnit.test('Bad string not being converted', function (assert) {
  assert.equal(transformCoordinatesString('abcd', ''), 'abcd');
});
