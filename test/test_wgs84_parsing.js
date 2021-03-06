/* global QUnit */

// Use "require" only if run from command line
if (typeof (require) !== 'undefined') {
  var parseWSG84 = require('../coords.js').parseWSG84;
}

QUnit.module('WGS84 Parsing');

QUnit.test('normal N-E coordinates', function (assert) {
  assert.ok(parseWSG84('N 47° 30.525 E 39° 27.966'));
});
QUnit.test('integer lat', function (assert) {
  assert.ok(parseWSG84('N 47° 30 E 39° 27.323'));
});
QUnit.test('integer lon', function (assert) {
  assert.ok(parseWSG84('N 47° 30.324 E 39° 27'));
});
QUnit.test('comma separated', function (assert) {
  assert.ok(parseWSG84('N 47° 30.324, E 39° 27.321'));
});
QUnit.test('slash separated', function (assert) {
  assert.ok(parseWSG84('N 47° 30.324 / E 39° 27.321'));
});
QUnit.test('backslash separated', function (assert) {
  assert.ok(parseWSG84('N 47° 30.324 \\ E 39° 27.321'));
});
QUnit.test('several spaces separated', function (assert) {
  assert.ok(parseWSG84('N 47° 30.324       E 39° 27.321'));
});
QUnit.test('south-west coordinates', function (assert) {
  assert.ok(parseWSG84('S 47° 30.525 W 39° 27.966'));
});
QUnit.test('apostrophe-suffix', function (assert) {
  assert.ok(parseWSG84("N 47° 30.525' E 39° 27.966'"));
});
QUnit.test('no degree symbol', function (assert) {
  assert.ok(parseWSG84("N 47 30.525' E 39 27.966'"));
});
QUnit.test('tick instead of degree', function (assert) {
  assert.ok(parseWSG84("N 47' 30.525' E 39' 27.966'"));
});
QUnit.test('no space after N', function (assert) {
  assert.ok(parseWSG84('N47° 30.525 E 39° 27.966'));
});
QUnit.test('no space after E', function (assert) {
  assert.ok(parseWSG84('N 47° 30.525 E39° 27.966'));
});
QUnit.test('with text in the beginning', function (assert) {
  assert.ok(parseWSG84('test word N 47° 30.525 E39° 27.966'));
});
QUnit.test('with comma', function (assert) {
  assert.ok(parseWSG84('N 47° 30,525 E 39° 27,966'));
});
QUnit.test('without space', function (assert) {
  assert.ok(parseWSG84('N 47°30.525 E 39°27.966'));
});
QUnit.test('with dots everywhere', function (assert) {
  assert.ok(parseWSG84('N58.23.528 E40.39.973'));
});
QUnit.test('180>lon>100', function (assert) {
  assert.ok(parseWSG84('N 47° 30.525 E 125° 27.966'));
});

QUnit.module('WGS84 Parsing Values');

QUnit.test('lat minutes as member', function (assert) {
  assert.equal(parseWSG84('N 47° 30.525 E 39° 27.966').lat_min, 30.525);
});
QUnit.test('lon letter', function (assert) {
  assert.equal(parseWSG84('N 47° 30.525 W 39° 27.966').lon, 'W');
});
QUnit.test('lon minutes integer', function (assert) {
  assert.equal(parseWSG84('N 47° 30.525 E 39° 27').lon_min, 27);
});
QUnit.test('with comma', function (assert) {
  assert.equal(parseWSG84('N 47° 30,525 E 39° 27.966').lat_min, 30.525);
});

QUnit.module('WGS84 Negative Parsing');

QUnit.test('two coordinates', function (assert) {
  assert.notOk(parseWSG84('N 47° 30.525 E39° 27.966 N 47° 30.525 E39° 27.966'));
});
QUnit.test('lat > 100', function (assert) {
  assert.notOk(parseWSG84('N 100° 30.525 E 39° 27.966'));
});
QUnit.test('lat > 90', function (assert) {
  assert.notOk(parseWSG84('N 91° 30.525 E 39° 27.966'));
});
QUnit.test('lon > 180', function (assert) {
  assert.notOk(parseWSG84('N 11° 30.525 E 206° 27.966'));
});
