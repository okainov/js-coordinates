function parseDD(line) {
  var re = /^\D*(-?[0-9]+(?:\.[0-9]{1,10})?)[,\s]+(-?[0-9]+(?:\.[0-9]{1,10})?)\D*$/;
  var match = re.exec(line.trim());
  if (!match) {
    return false;
  }
  var $lat = parseFloat(match[1]);
  var $lon = parseFloat(match[2]);
  if (Math.abs($lat) > 180 || Math.abs($lon) > 180) {
    return false;
  }
  return {'lat': $lat, 'lon': $lon};
}

function parseWSG84(line) {
  var re = /^\D*([NS])\s*(\d{1,2}).\s*(\d{1,2}(?:[.,]\d{1,4})?)'?[,\s/\\]+([EW])\s*(\d{1,2}).\s*(\d{1,2}(?:[.,]\d{1,4})?)'?\D*$/;
  var match = re.exec(line.trim());
  if (!match) {
    return false;
  }
  return {
    'lat': match[1], 'lat_deg': parseInt(match[2], 10), 'lat_min': parseFloat(match[3]),
    'lon': match[4], 'lon_deg': parseInt(match[5], 10), 'lon_min': parseFloat(match[6])
  };
}

function checkGlue(glue) {
  var newGlue = ', ';
  if (typeof glue === 'undefined') {
    newGlue = ', ';
  } else {
    newGlue = glue;
  }
  return newGlue;
}

/**
 * @returns {string}
 * @param {string} lat
 * @param {number} latDeg
 * @param {number} latMin
 * @param {string} lon
 * @param {number} lonDeg
 * @param {number} lonMin
 * @param {string} _glue
 */
function WGS84toDD(lat, latDeg, latMin, lon, lonDeg, lonMin, _glue) {
  var glue = checkGlue(_glue);

  var $la = latDeg + (latMin / 60);
  var $lo = lonDeg + (lonMin / 60);
  if (lat === 'S') $la = -$la;
  if (lon === 'W') $lo = -$lo;

  return $la.toFixed(5) + glue + $lo.toFixed(5);
}

/**
 * @returns {string}
 * @param {number} lat
 * @param {number} lon
 * @param {string} _glue symbols used to glue lat and lon together in result string
 */
function DDtoWGS84(lat, lon, _glue) {
  var glue = checkGlue(_glue);

  var $latLetter = lat >= 0 ? 'N' : 'S';
  var $lotLetter = lon >= 0 ? 'E' : 'W';

  var $lat = Math.abs(lat);
  var $lon = Math.abs(lon);

  var $latDeg = Math.floor($lat);
  var $lonDeg = Math.floor($lon);

  var $latMin = ($lat - $latDeg) * 60;
  var $lonMin = ($lon - $lonDeg) * 60;

  // \xB0 is °
  return $latLetter + ' ' + $latDeg + '\xB0 ' + $latMin.toFixed(3) + "'" + glue +
    $lotLetter + ' ' + $lonDeg + '\xB0 ' + $lonMin.toFixed(3) + "'";
}

function transformCoordinatesString(line, glue) {
  var coordsFrom = line.trim();
  var coordsTo = '[Unknown format]';

  var res = parseWSG84(coordsFrom);
  if (res) {
    coordsTo = WGS84toDD(res.lat, res.lat_deg, res.lat_min,
      res.lon, res.lon_deg, res.lon_min, glue);
  } else if (parseDD(coordsFrom)) {
    res = parseDD(coordsFrom);
    coordsTo = DDtoWGS84(res.lat, res.lon, glue);
  }
  return coordsTo;
}

function transformCoordinatesInElem(e, glue) {
  var coordsFrom = $(e).text().trim();
  $(e).html(transformCoordinatesString(coordsFrom, glue));
}

function transformCoordinatesInElemValue(e, glue) {
  var coordsFrom = $(e).val().trim();
  $(e).val(transformCoordinatesString(coordsFrom, glue));
}

function transformCoordinatesInElemByIdValue(id, glue) {
  var $elem = $('#' + id);
  var coordsFrom = $elem.val().trim();
  $elem.val(transformCoordinatesString(coordsFrom, glue));
}

function transformCoordinatesInElemById(id, glue) {
  var $elem = $('#' + id);
  transformCoordinatesInElem($elem, glue);
}

function transformCoordinatesInElemBySelector(selector, glue) {
  $(selector).each(function (index) {
    transformCoordinatesInElem(this, glue);
  });
}

if (typeof module !== 'undefined' && module.exports) {
  exports.parseDD = parseDD;
  exports.parseWSG84 = parseWSG84;

  exports.DDtoWGS84 = DDtoWGS84;
  exports.WGS84toDD = WGS84toDD;
}
