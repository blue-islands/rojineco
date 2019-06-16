/*
 * タイトル：インデックス画面JS
 * 説明    ：
 * 著作権  ：Copyright(c) 2018 LivLog llc.
 * 会社名  ：リブログ合同会社
 * 変更履歴：2019.05.16
 *        ：新規登録
 */
//34567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890
var IndexCtrl = {
//+----- ↓定数・変数の設定ココから -----------------------------------------------------------------+
    _className: 'IndexCtrl',
    CHANGE_DISTANCE: 50000,
    RANGE_DISTANCE: 10000,
    mymap: null,
    lastLat: 0,
    lastLng: 0,
    nostalgy: null,
    markers:[],
//+----- ↓functionの記述ココから -----------------------------------------------------------------+
    init: function UN_init() {
        var _functionName = 'UN_init';

        try {
            Util.startWriteLog(IndexCtrl._className,_functionName);
            // 処理開始
            IndexCtrl.dispSize();
            $(window).resize(function() {
                //リサイズされたときの処理
                IndexCtrl.dispSize();
            });

            IndexCtrl.mymap = L.map('mapid',{
                center: [35.7102, 139.8132],
                zoom: 13,
                zoomControl: false // default true
            })
         
            L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
                attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
                maxZoom: 18,
                id: 'mapbox.streets',
                accessToken: 'pk.eyJ1IjoiaGFvc2hpbWEiLCJhIjoiY2lsODJuMjNoMDlhbnZ0a3IxaGw0NDhqOSJ9.HrD7j0q54v_vOseYNVLeEg' //ここにaccess tokenを挿入
            }).addTo(IndexCtrl.mymap);

            var options = {
                enableHighAccuracy: true,
                timeout: 60000,
                maximumAge: 0
            };
            // 位置情報取得
            window.navigator.geolocation.watchPosition(IndexCtrl.success, IndexCtrl.error, options);
            // 処理終了
        }
        catch (ex) {
            logger.error(ex);
        }
        finally {
            Util.endWriteLog(IndexCtrl._className,_functionName);
        }
    },

    success: function UN_success(pos) {
        var _functionName = 'UN_success',
            _distance = 0,
            _lat = 0,
            _lng = 0;

        try {
            Util.startWriteLog(IndexCtrl._className,_functionName);
            // 処理開始
            // 緯度
            logger.info('latitude:' + pos.coords.latitude);
            // $('#latitude').val(pos.coords.latitude);
            // 経度
            logger.info('longitude:' + pos.coords.longitude);
            // $('#longitude').val(pos.coords.longitude);
            // 移動方向
            logger.info('heading:' + pos.coords.heading);
            // $('#heading').val(pos.coords.heading);
            // 移動速度
            logger.info('speed:' + pos.coords.speed);
            // $('#speed').val(pos.coords.speed);

            _lat = pos.coords.latitude; //緯度
            _lng = pos.coords.longitude; //経度
            _distance = geolib.getDistance(
                {latitude: _lat, longitude: _lng},
                {latitude: IndexCtrl.lastLat, longitude: IndexCtrl.lastLng}
            );

            if (IndexCtrl.RANGE_DISTANCE < _distance) {
                IndexCtrl.dispMarker(_lat, _lng);
            }

            if (IndexCtrl.CHANGE_DISTANCE < _distance) {
                // 1.$.ajaxメソッドで通信を行います。
                //  20行目のdataは、フォームの内容をserialize()している
                //  →serialize()の内容は、cs1=custom1&cs2=custom2
                $.ajax({	
                    url:'https://www.livlog.xyz/webapi/nostalgy', // 通信先のURL
                    type:'GET',		// 使用するHTTPメソッド
                    data:{
                        lat: _lat,
                        lng: _lng
                    }, // 送信するデータ
                    // 2. doneは、通信に成功した時に実行される
                    //  引数のdata1は、通信で取得したデータ
                    //  引数のtextStatusは、通信結果のステータス
                    //  引数のjqXHRは、XMLHttpRequestオブジェクト
                    }).done(function(ret,textStatus,jqXHR) {
                        logger.info(ret); //コンソールにJSONが表示される
                        IndexCtrl.lastLat = _lat;
                        IndexCtrl.lastLng = _lng;
                        IndexCtrl.nostalgy = ret.results;
                        IndexCtrl.dispMarker(_lat, _lng);
                    // 6. failは、通信に失敗した時に実行される
                    }).fail(function(jqXHR, textStatus, errorThrown ) {
                        logger.error(errorThrown);
                    // 7. alwaysは、成功/失敗に関わらず実行される
                    }).always(function(){
                        logger.info('***** 処理終了 *****');
                    });
            } 

            // 処理終了
        }
        catch (ex) {
            logger.error(ex);
        }
        finally {
            Util.endWriteLog(IndexCtrl._className,_functionName);
        }
    },

    error: function UN_error(err) {
        var _functionName = 'UN_error';

        try {
            Util.startWriteLog(IndexCtrl._className,_functionName);
            // 処理開始
            logger.error(err);
            // 処理終了
        }
        catch (ex) {
            logger.error(ex);
        }
        finally {
            Util.endWriteLog(IndexCtrl._className,_functionName);
        }
    },

    dispMarker: function UN_dispMarker(lat, lng) {
        var _functionName = 'UN_dispMarker',
            _myIcon = null,
            _nekoIcon1 = null,
            _nekoIcon2 = null,
            _nekoIcon3 = null,
            _distance = 0,
            _distanceAry = [],
            _min = 0,
            _lat = 0,
            _lng = 0,
            _up = [],
            _right = [],
            _down = [],
            _left = [],
            _bounds = 0,
            _pointLat = 0,
            _pointLng = 0,
            _point = [];

        try {
            Util.startWriteLog(IndexCtrl._className,_functionName);
            // 処理開始
            if (IndexCtrl.nostalgy) {
                if (IndexCtrl.markers) {
                    for (var i = 0; i < IndexCtrl.markers.length; i++) {
                        IndexCtrl.mymap.removeLayer(IndexCtrl.markers[i]);
                    }
                }

                _myIcon = L.icon({
                    iconUrl: 'https://rojine.co/img/8-bit-mario-icon-13.png',
                    iconRetinaUrl: 'https://rojine.co/img/8-bit-mario-icon-13.png',
                    iconSize: [24, 24],
                    iconAnchor: [12, 24],
                    popupAnchor: [0, -24],
                });

                for (var i = 0; i < IndexCtrl.nostalgy.length; i++) {
                    var data = IndexCtrl.nostalgy[i];
                    _distance = geolib.getDistance(
                        {latitude: lat, longitude: lng},
                        {latitude: data.lat, longitude: data.lng}
                    );
                    _distanceAry.push(_distance);
                }
                _min = Math.min.apply(null, _distanceAry);
                _lat = doRad(lat);
                _lng = doRad(lng);
                _up = vincenty(_lat, _lng, doRad(0), _min);
                _right = vincenty(_lat, _lng, doRad(90), _min);
                _down = vincenty(_lat, _lng, doRad(180), _min);
                _left = vincenty(_lat, _lng, doRad(270), _min);
                _bounds = geolib.getBounds([
                    { latitude: _up[0], longitude: _up[1] },
                    { latitude: _right[0], longitude: _right[1] },
                    { latitude: _down[0], longitude: _down[1] },
                    { latitude: _left[0], longitude: _left[1] },
                ]);

                logger.info(_bounds.minLat+','+_bounds.maxLng);
                logger.info(_bounds.maxLat+','+_bounds.minLng);
                IndexCtrl.mymap.setView([ lat, lng]); //地図を移動
                IndexCtrl.mymap.fitBounds([
                   [_bounds.minLat, _bounds.maxLng],
                   [_bounds.maxLat, _bounds.minLng]
                ]);

                var marker = L.marker([lat, lng], {icon: _myIcon}).addTo(IndexCtrl.mymap);
                IndexCtrl.markers.push(marker);

                for (var i = 0; i < IndexCtrl.nostalgy.length; i++) {
                    var data = IndexCtrl.nostalgy[i];
                    _distance = geolib.getDistance(
                        {latitude: lat, longitude: lng},
                        {latitude: data.lat, longitude: data.lng}
                    );
                    if (IndexCtrl.RANGE_DISTANCE > _distance) {

                        if (IndexCtrl.appearance(data)) {
                            _pointLat = doRad(data.lat);
                            _pointLng = doRad(data.lng);
                            var alpha12 = Math.floor(Math.random() * 359);
                            var length = Math.floor(Math.random() * 500);
                            _point = vincenty(_pointLat, _pointLng, doRad(alpha12), length);
    
                            var marker = L.marker([_point[0], _point[1]], {icon: IndexCtrl.rarity(data)}).addTo(IndexCtrl.mymap);
                            IndexCtrl.markers.push(marker);
                        }
                    }
                }
            }

            // 処理終了
        }
        catch (ex) {
            logger.error(ex);
        }
        finally {
            Util.endWriteLog(IndexCtrl._className,_functionName);
        }
    },

    dispSize: function UN_dispSize() {
        var _functionName = 'UN_dispSize',
            _navbarHeight,
            _windowHeight;

        try {
            Util.startWriteLog(IndexCtrl._className,_functionName);
            // 処理開始
            // _navbarHeight = $('.navbar').height();
            _windowHeight = $(window).height();
            $('#mapid').height(_windowHeight);
            // 処理終了
        }
        catch (ex) {
            logger.error(ex);
        }
        finally {
            Util.endWriteLog(IndexCtrl._className,_functionName);
        }
    },

    appearance: function UN_appearance(data) {
        var _functionName = 'UN_appearance',
            _num = 0;

        try {
            Util.startWriteLog(IndexCtrl._className,_functionName);
            // 処理開始
            _num = Math.floor(Math.random() * 60);
            if (data.alleyRatio > _num) {
                return true;
            } else {
                return false;
            }
            // 処理終了
        }
        catch (ex) {
            logger.error(ex);
        }
        finally {
            Util.endWriteLog(IndexCtrl._className,_functionName);
        }
    },
    
    rarity: function UN_rarity(data) {
        var _functionName = 'UN_rarity';

        try {
            Util.startWriteLog(IndexCtrl._className,_functionName);
            // 処理開始
            if (15 >= data.nostalgiaRatio) {
                return L.icon({
                    iconUrl: 'https://rojine.co/img/8-bit-mario-icon-7.png',
                    iconRetinaUrl: 'https://rojine.co/img/8-bit-mario-icon-7.png',
                    iconSize: [24, 24],
                    iconAnchor: [12, 24],
                    popupAnchor: [0, -24],
                });
            } else if (30 >= data.nostalgiaRatio) {
                return L.icon({
                    iconUrl: 'https://rojine.co/img/8-bit-mario-icon-14.png',
                    iconRetinaUrl: 'https://rojine.co/img/8-bit-mario-icon-14.png',
                    iconSize: [24, 24],
                    iconAnchor: [12, 24],
                    popupAnchor: [0, -24],
                });
            } else {
                return L.icon({
                    iconUrl: 'https://rojine.co/img/8-bit-mario-icon-15.png',
                    iconRetinaUrl: 'https://rojine.co/img/8-bit-mario-icon-15.png',
                    iconSize: [24, 24],
                    iconAnchor: [12, 24],
                    popupAnchor: [0, -24],
                });
            }
            // 処理終了
        }
        catch (ex) {
            logger.error(ex);
        }
        finally {
            Util.endWriteLog(IndexCtrl._className,_functionName);
        }
    },
};


    
