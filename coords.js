function parseDD(line) {

    var re = /(-?[0-9]+(?:\.[0-9]{1,10})?)[,\s]+(-?[0-9]+(?:\.[0-9]{1,10})?)/;
    var match = re.exec(line.trim());
    if (!match) {
        return false;
    }
    var $lat = parseFloat(match[1]);
    var $lon = parseFloat(match[2]);
    if (Math.abs($lat) > 180 || Math.abs($lon) > 180) {
        return false;
    }
    return {'lat': $lat, 'lon': $lon}
}

function parseWSG84(line) {

    var re = /^([NS]) (\d{1,2}). (\d{1,2}(?:\.\d{1,4})?)'?.?\s*([EW]) (\d{1,2}). (\d{1,2}(?:\.\d{1,4})?)'?/;
    var match = re.exec(line.trim());
    if (!match) {
        return false;
    }
    return {
        'lat': match[1], 'lat_deg': parseInt(match[2], 10), 'lat_min': parseFloat(match[3]),
        'lon': match[4], 'lon_deg': parseInt(match[5], 10), 'lon_min': parseFloat(match[6])
    }
}

function checkGlue(glue) {
    if (typeof glue === 'undefined') {
        glue = ", ";
    }
    return glue;
}

/**
 * @returns {string}
 */
function WGS84toDD(lat, lat_deg, lat_min, lon, lon_deg, lon_min, glue) {
    glue = checkGlue(glue);

    $la = lat_deg + (lat_min / 60);
    $lo = lon_deg + (lon_min / 60);
    if (lat === 'S') $la = -$la;
    if (lon === 'W') $lo = -$lo;

    return $la.toFixed(5) + glue + $lo.toFixed(5);
}

/**
 * @returns {string}
 */
function DDtoWGS84(lat, lon, glue) {
    glue = checkGlue(glue);

    $la_letter = lat >= 0 ? 'N' : 'S';
    $lo_letter = lon >= 0 ? 'E' : 'W';

    $lat = Math.abs(lat);
    $lon = Math.abs(lon);

    $lat_deg = Math.floor($lat);
    $lon_deg = Math.floor($lon);

    $lat_min = ($lat - $lat_deg) * 60;
    $lon_min = ($lon - $lon_deg) * 60;

    //\xB0 is °
    return $la_letter + ' ' + $lat_deg + "\xB0 " + $lat_min.toFixed(3) + "'" + glue +
        $lo_letter + ' ' + $lon_deg + "\xB0 " + $lon_min.toFixed(3) + "'";
}

function transformCoordinatesString(line, glue) {

    var coordsFrom = line.trim();
    var coordsTo = "[Unknown format]";
    var res = parseDD(coordsFrom);
    if (res) {
        coordsTo = DDtoWGS84(res['lat'], res['lon'], glue);
    }
    else if (parseWSG84(coordsFrom)) {
        res = parseWSG84(coordsFrom);
        coordsTo = WGS84toDD(res['lat'], res['lat_deg'], res['lat_min'],
            res['lon'], res['lon_deg'], res['lon_min'], glue);
    }
    return coordsTo
}

function transformCoordinatesInElem(e, glue) {
    var coordsFrom = $(e).text().trim();
    $(e).html(transformCoordinatesString(coordsFrom, glue));
}

function transformCoordinatesInElemById(id, glue) {
    var $elem = $("#" + id);
    transformCoordinatesInElem($elem, glue);
}

if (typeof module !== 'undefined' && module.exports) {
    exports.parseDD = parseDD;
    exports.parseWSG84 = parseWSG84;

    exports.DDtoWGS84 = DDtoWGS84;
    exports.WGS84toDD = WGS84toDD;
}