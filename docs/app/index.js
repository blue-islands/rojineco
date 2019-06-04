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

            IndexCtrl.mymap = L.map('mapid').setView([51.505, -0.09], 13);
            L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
            // L.tileLayer('https://a.tiles.mapbox.com/v4/duncangraham.552f58b0/{z}/{x}\{y}.png?access_token={accessToken}', {
                attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            //    attribution: '<a href=\"https:\/\/www.mapbox.com\/about\/maps\/\" target=\"_blank\">&copy; Mapbox &copy; OpenStreetMap<\/a> <a class=\"mapbox-improve-map\" href=\"https:\/\/www.mapbox.com\/map-feedback\/\" target=\"_blank\">Improve this map<\/a>',
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
            $('#latitude').val(pos.coords.latitude);
            // 経度
            logger.info('longitude:' + pos.coords.longitude);
            $('#longitude').val(pos.coords.longitude);
            // 移動方向
            logger.info('heading:' + pos.coords.heading);
            $('#heading').val(pos.coords.heading);
            // 移動速度
            logger.info('speed:' + pos.coords.speed);
            $('#speed').val(pos.coords.speed);

            _lat = pos.coords.latitude; //緯度
            _lng = pos.coords.longitude; //経度
            IndexCtrl.mymap.setView([ _lat,_lng ]); //地図を移動
            IndexCtrl.dispMarker(_lat, _lng);

            _distance = geolib.getDistance(
                {latitude: _lat, longitude: _lng},
                {latitude: IndexCtrl.lastLat, longitude: IndexCtrl.lastLng}
            );

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
            _nekoIcon = null,
            _distance = 0;

        try {
            Util.startWriteLog(IndexCtrl._className,_functionName);
            // 処理開始
            if (IndexCtrl.nostalgy) {
                if (IndexCtrl.markers) {
                    for (var i = 0; i < IndexCtrl.markers.length; i++) {
                        IndexCtrl.mymap.removeLayer(IndexCtrl.markers[i]);
                    }
                }

                _nekoIcon = L.icon({
                    iconUrl: 'https://rojine.co/img/cat4.gif',
                    iconRetinaUrl: 'https://rojine.co/img/cat4.gif',
                    iconSize: [50, 50],
                    iconAnchor: [25, 50],
                    popupAnchor: [0, -50],
                });

                for (var i = 0; i < IndexCtrl.nostalgy.length; i++) {
                    var data = IndexCtrl.nostalgy[i];
                    _distance = geolib.getDistance(
                        {latitude: lat, longitude: lng},
                        {latitude: data.lat, longitude: data.lng}
                    );
                    if (IndexCtrl.RANGE_DISTANCE > _distance) {
                        var marker = L.marker([data.lat, data.lng], {icon: _nekoIcon}).addTo(IndexCtrl.mymap);
                        IndexCtrl.markers.push(marker);
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
};


    
