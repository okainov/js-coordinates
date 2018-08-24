/* global QUnit */

// Use "require" only if run from command line
if (typeof (require) !== 'undefined') {
  var parseDD = require('../coords.js').parseDD;
}

QUnit.module('Decimal Degrees Parsing');

QUnit.test('float coordinates', function (assert) {
  assert.ok(parseDD('32.2341, 24.391353'));
});
QUnit.test('long coordinates', function (assert) {
  assert.ok(parseDD('32.123456789, 24.123456789'));
});
QUnit.test('integer coordinates', function (assert) {
  assert.ok(parseDD('1, 2'));
});
QUnit.test('negative lat', function (assert) {
  assert.ok(parseDD('-1, 2'));
});
QUnit.test('negative lon', function (assert) {
  assert.ok(parseDD('1, -2'));
});
QUnit.test('no spaces between coordinates', function (assert) {
  assert.ok(parseDD('32.2341,24.391353'));
});
QUnit.test('several spaces between coordinates', function (assert) {
  assert.ok(parseDD('32.2341,      24.391353'));
});
QUnit.test('no comma', function (assert) {
  assert.ok(parseDD('32.2341 24.391353'));
});
QUnit.test('not in the beginning', function (assert) {
  assert.ok(parseDD('something test 32.2341, 24.391353'));
});
QUnit.test('not in the end', function (assert) {
  assert.ok(parseDD('32.2341, 24.391353ppp test'));
});

QUnit.module('Decimal Degrees Parsing Values');

QUnit.test('lat integer coordinates', function (assert) {
  assert.equal(parseDD('1, 2').lat, 1);
});

QUnit.test('lon float coordinates', function (assert) {
  assert.equal(parseDD('1, -32.123').lon, -32.123);
});

QUnit.test('as member', function (assert) {
  assert.equal(parseDD('1, -32.123').lon, -32.123);
});
QUnit.test('inline no spaces', function (assert) {
  assert.deepEqual(parseDD('inside1,3.2text'), {'lat': 1.0, 'lon': 3.2});
});

QUnit.module('Decimal Degrees Parsing Negative');

QUnit.test('with letters', function (assert) {
  assert.notOk(parseDD('1, abc-2'));
});
QUnit.test('long number', function (assert) {
  assert.notOk(parseDD('123456789'));
});

QUnit.test('long lat', function (assert) {
  assert.notOk(parseDD('123456789.13, 1.32'));
});
QUnit.test('long lat 1', function (assert) {
  assert.notOk(parseDD('1111111111.13, 1.32'));
});
QUnit.test('not together with other coords in the end', function (assert) {
  assert.notOk(parseDD('1.123 2.345 test words 14'));
});
QUnit.test('not together with other coords in the beginning', function (assert) {
  assert.notOk(parseDD('1qqq1.123 2.345 test word'));
});
QUnit.test('two coordinates', function (assert) {
  assert.notOk(parseDD('32.2341, 24.391353 32.2341, 24.391353'));
});
QUnit.test('not WGS', function (assert) {
  assert.notOk(parseDD('N58.23.528 E40.39.973'));
});
