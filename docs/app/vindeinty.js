var check;
var Radius_long = 6378137.0;
var Henpei = 1 / 298.257222101;
var Radius_short = Radius_long * (1 - Henpei); // 6356752.314 
function doRad(a) {
    return a / 180 * Math.PI;
}

function radDo(a) {
    return a * 180 / Math.PI;
}

function xy(x, y) {
    return Math.pow(x, y);
}

function vincenty(lat1, lng1, alpha12, length) {
    var U1 = Math.atan((1 - Henpei) * Math.tan(lat1));
    var sigma1 = Math.atan(Math.tan(U1) / Math.cos(alpha12));
    var alpha = Math.asin(Math.cos(U1) * Math.sin(alpha12));
    var u2 = xy(Math.cos(alpha), 2) * (xy(Radius_long, 2) - xy(Radius_short, 2)) / xy(Radius_short, 2);
    var A = 1 + (u2 / 16384) * (4096 + u2 * (-768 + u2 * (320 - 175 * u2)));
    var B = (u2 / 1024) * (256 + u2 * (-128 + u2 * (74 - 47 * u2)));
    var sigma = length / Radius_short / A;
    do {
        var sigma0 = sigma;
        var dm2 = 2 * sigma1 + sigma;
        var x = Math.cos(sigma) * (-1 + 2 * xy(Math.cos(dm2), 2)) - B / 6 * Math.cos(dm2) * (-3 + 4 * xy(Math.sin(dm2), 2)) * (-3 + 4 * xy(Math.cos(dm2), 2));
        var dSigma = B * Math.sin(sigma) * (Math.cos(dm2) + B / 4 * x);
        sigma = length / Radius_short / A + dSigma;
    } while (Math.abs(sigma0 - sigma) > 1e-9);

    var x = Math.sin(U1) * Math.cos(sigma) + Math.cos(U1) * Math.sin(sigma) * Math.cos(alpha12)
    var y = (1 - Henpei) * xy(xy(Math.sin(alpha), 2) + xy(Math.sin(U1) * Math.sin(sigma) - Math.cos(U1) * Math.cos(sigma) * Math.cos(alpha12), 2), 1 / 2);
    var lamda = Math.sin(sigma) * Math.sin(alpha12) / (Math.cos(U1) * Math.cos(sigma) - Math.sin(U1) * Math.sin(sigma) * Math.cos(alpha12));
    lamda = Math.atan(lamda);
    var C = (Henpei / 16) * xy(Math.cos(alpha), 2) * (4 + Henpei * (4 - 3 * xy(Math.cos(alpha), 2)));
    var z = Math.cos(dm2) + C * Math.cos(sigma) * (-1 + 2 * xy(Math.cos(dm2), 2));
    var omega = lamda - (1 - C) * Henpei * Math.sin(alpha) * (sigma + C * Math.sin(sigma) * z);
    return [radDo(Math.atan(x / y)), radDo(lng1 + omega)];
}