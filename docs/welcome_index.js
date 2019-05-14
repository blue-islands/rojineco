document.addEventListener("DOMContentLoaded", function() {
 
    var options = {
        enableHighAccuracy: true,
        timeout: 60000,
        maximumAge: 0
    };
    // 位置情報取得
    window.navigator.geolocation.watchPosition(success, error, options);
}, false);
 
 
function success(pos) {
    // 緯度
    document.querySelector('#latitude').textContent = pos.coords.latitude;
    // 経度
    document.querySelector('#longitude').textContent = pos.coords.longitude;
    // 移動方向
    document.querySelector('#heading').textContent = pos.coords.heading;
    // 移動速度
    document.querySelector('#speed').textContent = pos.coords.speed;
 
    sendMessage(pos);
}
 
var dispatcher = new WebSocketRails(location.host + '/websocket', true);
 
function sendMessage(pos) {
    var location = {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        heading: pos.coords.heading,
        speed: pos.coords.heading
    };
 
    dispatcher.trigger('location_message', location);
}
 
function error(err) {
    console.warn('ERROR(' + err.code + '): ' + err.message);
}