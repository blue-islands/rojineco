/*
 * タイトル：インデックス画面JS
 * 説明    ：
 * 著作権  ：Copyright(c) 2019 rojineco project.
 * 会社名  ：ロジネコプロジェクト
 * 変更履歴：2019.05.16
 *        ：新規登録
 */
//34567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890
var IndexCtrl = {};
//+----- ↓定数・変数の設定ココから -----------------------------------------------------------------+
IndexCtrl.domain = 'https://www.livlog.xyz/webapi/';
//IndexCtrl.domain = 'http://localhost:8080/';
IndexCtrl = {
    _className: 'IndexCtrl',
    SESSION_UUID: "SESSION_UUID",
    CHANGE_DISTANCE: 30000,
    RANGE_DISTANCE: 15000,
    GET_DISTANCE: 100,
    userId: null,
    mymap: null,
    lat: 0,
    lng: 0,
    changeLat: 0,
    changeLng: 0,
    rangeLat: 0,
    rangeLng: 0,
    nostalgy: null,
    temple: null,
    park: null,
    myMarker: null,
    nostalgyMarkers:[],
    templeMarkers:[],
    parkMarkers:[],
    photos: [],
    autoF: true,
    urls: {
        login: IndexCtrl.domain + 'login',
        who: IndexCtrl.domain + 'who',
        getNostalgy: IndexCtrl.domain + 'getNostalgy',
        getTemple: IndexCtrl.domain + 'getTemple',
        getPark: IndexCtrl.domain + 'getPark',
        setComment: IndexCtrl.domain + 'setComment',
        getComment: IndexCtrl.domain + 'getComment',
        removeComment: IndexCtrl.domain + 'removeComment',
        setPhoto: IndexCtrl.domain + 'setPhoto',
        getPhoto: IndexCtrl.domain + 'getPhoto',
        getPhotoList: IndexCtrl.domain + 'getPhotoList',
        removePhoto: IndexCtrl.domain + 'removePhoto',
    },
    mapIcon: {
        my: L.icon({
            iconUrl: './img/walk_back.gif',
            iconRetinaUrl: './img/walk_back.gif',
            iconSize: [50, 60],
            iconAnchor: [25, 60],
            popupAnchor: [0, -60],
        }),
        gold1: L.icon({
            iconUrl: './img/cat_g1.png',
            iconRetinaUrl: './img/cat_g1.png',
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32],
        }),
        gold2: L.icon({
            iconUrl: './img/cat_g2.png',
            iconRetinaUrl: './img/cat_g2.png',
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32],
        }),
        gold3: L.icon({
            iconUrl: './img/cat_g3.png',
            iconRetinaUrl: './img/cat_g3.png',
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32],
        }),
        gold4: L.icon({
            iconUrl: './img/cat_g3.png',
            iconRetinaUrl: './img/cat_g3.png',
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32],
        }),
        silver1: L.icon({
            iconUrl: './img/cat_s1.png',
            iconRetinaUrl: './img/cat_s1.png',
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32],
        }),
        silver2: L.icon({
            iconUrl: './img/cat_s2.png',
            iconRetinaUrl: './img/cat_s2.png',
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32],
        }),
        silver3: L.icon({
            iconUrl: './img/cat_s3.png',
            iconRetinaUrl: './img/cat_s3.png',
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32],
        }),
        silver4: L.icon({
            iconUrl: './img/cat_s3.png',
            iconRetinaUrl: './img/cat_s3.png',
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32],
        }),
        bronze1: L.icon({
            iconUrl: './img/cat_b1.png',
            iconRetinaUrl: './img/cat_b1.png',
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32],
        }),
        bronze2: L.icon({
            iconUrl: './img/cat_b2.png',
            iconRetinaUrl: './img/cat_b2.png',
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32],
        }),
        bronze3: L.icon({
            iconUrl: './img/cat_b3.png',
            iconRetinaUrl: './img/cat_b3.png',
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32],
        }),
        bronze4: L.icon({
            iconUrl: './img/cat_b3.png',
            iconRetinaUrl: './img/cat_b3.png',
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32],
        }),
        photo: L.icon({
            iconUrl: './img/camera.png',
            iconRetinaUrl: './img/camera.png',
            iconSize: [54, 40],
            iconAnchor: [27, 40],
            popupAnchor: [0, -20],
        }),
        shrine: L.icon({
            iconUrl: './img/shrine.png',
            iconRetinaUrl: './img/shrine.png',
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32],
        }),
        temple: L.icon({
            iconUrl: './img/temple.png',
            iconRetinaUrl: './img/temple.png',
            iconSize: [31, 30],
            iconAnchor: [15, 30],
            popupAnchor: [0, -30],
        }),
        park: L.icon({
            iconUrl: './img/park.png',
            iconRetinaUrl: './img/park.png',
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32],
        }),
    },

//+----- ↓functionの記述ココから -----------------------------------------------------------------+
    init: function UN_init() {
        var _functionName = 'UN_init';

        try {
            Util.startWriteLog(IndexCtrl._className,_functionName);
            // 処理開始
            // UUIDの取得
            IndexCtrl.userId = localStorage.getItem(IndexCtrl.SESSION_UUID);
            if (IndexCtrl.userId == null) {
                IndexCtrl.userId = Util.uuid();
                localStorage.setItem(IndexCtrl.SESSION_UUID, IndexCtrl.userId);
            }
            // ボタンの表示制御
            IndexCtrl.changeBtn();

            IndexCtrl.dispSize();
            $(window).resize(function() {
                //リサイズされたときの処理
                IndexCtrl.dispSize();
            });

            // 自動ボタン
            $(document).on('click', '#doAuto', function() {
                // clickイベントの処理
                IndexCtrl.auto();
            });
            // 設定ボタン
            $(document).on('click', '#doSetting', function() {
                // clickイベントの処理
                $('#settingView').show();
                $('#listView').hide();
                $('#photoView').hide();
            });
            // 設定閉じるボタン
            $(document).on('click', '#doSettingClose', function() {
                // clickイベントの処理
                $('#settingView').hide();
            });
            // 写真一覧ボタン
            $(document).on('click', '#doList', function() {
                // clickイベントの処理
                $('#settingView').hide();
                $('#listView').show();
                $('#photoView').hide();
            });
            // 写真一覧閉じるボタン
            $(document).on('click', '#doListClose', function() {
                // clickイベントの処理
                $('#listView').hide();
            });
            // 写真撮影ボタン
            $(document).on('click', '#doPhoto', function() {
                // clickイベントの処理
                $('#settingView').hide();
                $('#listView').hide();
                $('#photoView').show();
            });
            // 写真送信ボタン
            $(document).on('click', '#doPhotoSendTo', function() {
                // clickイベントの処理
                IndexCtrl.photoSendTo();
            });
            // 写真撮影閉じるボタン
            $(document).on('click', '#doPhotoClose', function() {
                // clickイベントの処理
                $('#photoView').hide();
            });
            // Twitterログインボタン
            $(document).on('click', '#doTwitterLogin', function() {
                // clickイベントの処理
                LoginCtrl.login();
            });
            // Twitterログアウトボタン
            $(document).on('click', '#doTwitterLogout', function() {
                // clickイベントの処理
                LoginCtrl.logout();
            });
            // ネコ表示閉じるボタン
            $(document).on('click', '#doCatClose', function() {
                // clickイベントの処理
                $('#catView').hide();
            });
            
            // ビューの非表示
            $('#settingView').hide();
            $('#listView').hide();
            $('#photoView').hide();
            $('#catView').hide();

            IndexCtrl.mymap = L.map('mymap',{
                center: [35.7102, 139.8132],
                zoom: 13,
                zoomControl: false // default true
            })
         
            // L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
            //     attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            //     maxZoom: 18,
            //     id: 'mapbox.streets',
            //     accessToken: 'pk.eyJ1IjoiaGFvc2hpbWEiLCJhIjoiY2lsODJuMjNoMDlhbnZ0a3IxaGw0NDhqOSJ9.HrD7j0q54v_vOseYNVLeEg' //ここにaccess tokenを挿入
            // }).addTo(IndexCtrl.mymap);
            L.tileLayer('https://{s}.tile.thunderforest.com/pioneer/{z}/{x}/{y}.png?apikey={apikey}', {
                attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                apikey: 'ed224a20677d4dd1a89710617d85df19',
                maxZoom: 22
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
            _changeDistance = 0,
            _rangeDistance = 0,
            _lat = 0,
            _lng = 0,
            _myIcon = null;

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
            IndexCtrl.lat = _lat;
            IndexCtrl.lng = _lng;
            _changeDistance = geolib.getDistance(
                {latitude: _lat, longitude: _lng},
                {latitude: IndexCtrl.changeLat, longitude: IndexCtrl.changeLng}
            );
            _rangeDistance = geolib.getDistance(
                {latitude: _lat, longitude: _lng},
                {latitude: IndexCtrl.rangeLat, longitude: IndexCtrl.rangeLng}
            );

            // アイコン設定
            _myIcon = IndexCtrl.mapIcon.my;

            if (IndexCtrl.myMarker != null) {
                IndexCtrl.mymap.removeLayer(IndexCtrl.myMarker);
            }
            IndexCtrl.myMarker = L.marker([_lat, _lng], {icon: _myIcon}).addTo(IndexCtrl.mymap);

            // 自分の表示位置を中心に
            if (IndexCtrl.autoF) {
                IndexCtrl.autoMove(_lat, _lng);
            }
            
            // ネコの当たり判定
            IndexCtrl.judgment();

            // 表示マーカーの制御
            if ((IndexCtrl.RANGE_DISTANCE /2) < _rangeDistance) {
                IndexCtrl.dispNostalgy(_lat, _lng);
            }
            if ((IndexCtrl.RANGE_DISTANCE /4) < _rangeDistance) {
                IndexCtrl.rangeLat = _lat;
                IndexCtrl.rangeLng = _lng;
                IndexCtrl.dispTemple(_lat, _lng);
                IndexCtrl.dispPark(_lat, _lng);
                IndexCtrl.dispPhoto(_lat, _lng);
            }

            // データ再取得の制御
            if (IndexCtrl.CHANGE_DISTANCE < _changeDistance) {

                $.ajax({	
                    url:IndexCtrl.urls.getNostalgy, // 通信先のURL
                    type:'GET',		// 使用するHTTPメソッド
                    data:{
                        lat: _lat,
                        lng: _lng,
                        distance: IndexCtrl.CHANGE_DISTANCE
                    }, // 送信するデータ
                }).done(function(ret,textStatus,jqXHR) {
                    logger.info(ret); //コンソールにJSONが表示される
                    IndexCtrl.changeLat = _lat;
                    IndexCtrl.changeLng = _lng;
                    IndexCtrl.nostalgy = ret.results;
                    IndexCtrl.dispNostalgy(_lat, _lng);
                }).fail(function(jqXHR, textStatus, errorThrown ) {
                    logger.error(errorThrown);
                // }).always(function(){
                //     logger.info('***** 処理終了 *****');
                });

                $.ajax({	
                    url:IndexCtrl.urls.getTemple, // 通信先のURL
                    type:'GET',		// 使用するHTTPメソッド
                    data:{
                        lat: _lat,
                        lng: _lng,
                        distance: IndexCtrl.CHANGE_DISTANCE
                    }, // 送信するデータ
                }).done(function(ret,textStatus,jqXHR) {
                    logger.info(ret); //コンソールにJSONが表示される
                    IndexCtrl.changeLat = _lat;
                    IndexCtrl.changeLng = _lng;
                    IndexCtrl.temple = ret.results;
                    IndexCtrl.dispTemple(_lat, _lng);
                }).fail(function(jqXHR, textStatus, errorThrown ) {
                    logger.error(errorThrown);
                // }).always(function(){
                //     logger.info('***** 処理終了 *****');
                });

                $.ajax({	
                    url:IndexCtrl.urls.getPark, // 通信先のURL
                    type:'GET',		// 使用するHTTPメソッド
                    data:{
                        lat: _lat,
                        lng: _lng,
                        distance: IndexCtrl.CHANGE_DISTANCE
                    }, // 送信するデータ
                }).done(function(ret,textStatus,jqXHR) {
                    logger.info(ret); //コンソールにJSONが表示される
                    IndexCtrl.changeLat = _lat;
                    IndexCtrl.changeLng = _lng;
                    IndexCtrl.park = ret.results;
                    IndexCtrl.dispPark(_lat, _lng);
                }).fail(function(jqXHR, textStatus, errorThrown ) {
                    logger.error(errorThrown);
                // }).always(function(){
                //     logger.info('***** 処理終了 *****');
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

    dispNostalgy: function UN_dispNostalgy(lat, lng) {
        var _functionName = 'UN_dispNostalgy',
            _distance = 0,
            _pointLat = 0,
            _pointLng = 0,
            _point = [];

        try {
            Util.startWriteLog(IndexCtrl._className,_functionName);
            // 処理開始
            if (IndexCtrl.nostalgy) {
                if (IndexCtrl.nostalgyMarkers) {
                    for (var i = 0; i < IndexCtrl.nostalgyMarkers.length; i++) {
                        IndexCtrl.mymap.removeLayer(IndexCtrl.nostalgyMarkers[i]);
                    }
                }

                IndexCtrl.nostalgyMarkers = [];

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
                            marker.data = data;
                            IndexCtrl.nostalgyMarkers.push(marker);
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

    dispTemple: function UN_dispTemple(lat, lng) {
        var _functionName = 'UN_dispTemple',
            _distance = 0;

        try {
            Util.startWriteLog(IndexCtrl._className,_functionName);
            // 処理開始
            if (IndexCtrl.temple) {
                if (IndexCtrl.templeMarkers) {
                    for (var i = 0; i < IndexCtrl.templeMarkers.length; i++) {
                        IndexCtrl.mymap.removeLayer(IndexCtrl.templeMarkers[i]);
                    }
                }

                IndexCtrl.templeMarkers = [];

                for (var i = 0; i < IndexCtrl.temple.length; i++) {
                    var data = IndexCtrl.temple[i];
                    _distance = geolib.getDistance(
                        {latitude: lat, longitude: lng},
                        {latitude: data.location[1], longitude: data.location[0]}
                    );
                    if ((IndexCtrl.RANGE_DISTANCE /2) > _distance) {
                      
                        if (data.genre.includes('神社')) {
                            var marker = L.marker([data.location[1], data.location[0]], {icon: IndexCtrl.mapIcon.shrine}).addTo(IndexCtrl.mymap);
                            marker.data = data;
                            IndexCtrl.templeMarkers.push(marker);
                        } else if (data.genre.includes('寺院')) {
                            // var marker = L.marker([data.location[1], data.location[0]], {icon: IndexCtrl.mapIcon.temple}).addTo(IndexCtrl.mymap);
                            // marker.data = data;
                            // IndexCtrl.templeMarkers.push(marker);
                        } else if (data.genre.includes('教会')) {
                            // var marker = L.marker([data.location[1], data.location[0]], {icon: IndexCtrl.mapIcon.temple}).addTo(IndexCtrl.mymap);
                            // marker.data = data;
                            // IndexCtrl.templeMarkers.push(marker);
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

    dispPark: function UN_dispPark(lat, lng) {
        var _functionName = 'UN_dispPark',
            _distance = 0;

        try {
            Util.startWriteLog(IndexCtrl._className,_functionName);
            // 処理開始
            if (IndexCtrl.park) {
                if (IndexCtrl.parkMarkers) {
                    for (var i = 0; i < IndexCtrl.parkMarkers.length; i++) {
                        IndexCtrl.mymap.removeLayer(IndexCtrl.parkMarkers[i]);
                    }
                }

                IndexCtrl.parkMarkers = [];

                for (var i = 0; i < IndexCtrl.park.length; i++) {
                    var data = IndexCtrl.park[i];
                    _distance = geolib.getDistance(
                        {latitude: lat, longitude: lng},
                        {latitude: data.location[1], longitude: data.location[0]}
                    );
                    if ((IndexCtrl.RANGE_DISTANCE /2) > _distance) {
                        var marker = L.marker([data.location[1], data.location[0]], {icon: IndexCtrl.mapIcon.park}).addTo(IndexCtrl.mymap);
                        marker.data = data;
                        IndexCtrl.parkMarkers.push(marker);
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
            // _navbarHeight,
            _windowHeight;

        try {
            Util.startWriteLog(IndexCtrl._className,_functionName);
            // 処理開始
            // _navbarHeight = $('.navbar').height();
            _windowHeight = $(window).height();
            $('body').height(_windowHeight);
            // 処理終了
        }
        catch (ex) {
            logger.error(ex);
        }
        finally {
            Util.endWriteLog(IndexCtrl._className,_functionName);
        }
    },
    
    autoMove: function UN_autoMove(lat, lng) {
        var _functionName = 'UN_autoMove',
            _distance = 0,
            _distanceAry = [],
            _min = 0,
            _lat = 0,
            _lng = 0,
            _up = [],
            _right = [],
            _down = [],
            _left = [],
            _bounds = {};

        try {
            Util.startWriteLog(IndexCtrl._className,_functionName);
            // 処理開始
            if (IndexCtrl.nostalgy == null) {
                return;
            }

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
        var _functionName = 'UN_rarity',
            _ran = 0;

        try {
            Util.startWriteLog(IndexCtrl._className,_functionName);
            // 処理開始
            _ran = Math.floor( Math.random() * 4 ) + 1;

            if (15 >= data.nostalgiaRatio) {
                switch(_ran) {
                    case 1:
                        return IndexCtrl.mapIcon.gold1; 
                    case 2:
                        return IndexCtrl.mapIcon.gold2; 
                    case 3:
                        return IndexCtrl.mapIcon.gold3;
                    case 4:
                        return IndexCtrl.mapIcon.gold4;
                }
            } else if (30 >= data.nostalgiaRatio) {
                switch(_ran) {
                    case 1:
                        return IndexCtrl.mapIcon.silver1; 
                    case 2:
                        return IndexCtrl.mapIcon.silver2; 
                    case 3:
                        return IndexCtrl.mapIcon.silver3;
                    case 4:
                        return IndexCtrl.mapIcon.silver4;
                }
            } else {
                switch(_ran) {
                    case 1:
                        return IndexCtrl.mapIcon.bronze1; 
                    case 2:
                        return IndexCtrl.mapIcon.bronze2; 
                    case 3:
                        return IndexCtrl.mapIcon.bronze3;
                    case 4:
                        return IndexCtrl.mapIcon.bronze4;
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

    auto: function UN_auto() {
        var _functionName = 'UN_auto';

        try {
            Util.startWriteLog(IndexCtrl._className,_functionName);
            // 処理開始
            IndexCtrl.autoF
            if (IndexCtrl.autoF) {
                $('#doAuto').html('手動');
                IndexCtrl.autoF = false;
            } else {
                $('#doAuto').html('自動');
                IndexCtrl.autoF = true;
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

    judgment: function UN_judgment() {
        var _functionName = 'UN_judgment',
            _nostalgyMarkers = null,
            _data = null,
            _distance = 0;

        try {
            Util.startWriteLog(IndexCtrl._className,_functionName);
            // 処理開始
            if (IndexCtrl.nostalgyMarkers) {
                for (var i = 0; i < IndexCtrl.nostalgyMarkers.length; i++) {
                    _nostalgyMarkers = IndexCtrl.nostalgyMarkers[i];
                    _data = _nostalgyMarkers.data;
                    _distancee = geolib.getDistance(
                        {latitude: IndexCtrl.lat, longitude: IndexCtrl.lng},
                        {latitude: _data.lat, longitude: _data.lng}
                    );
                    // 指定の範囲内に現れたら戦闘画面を表示
                    if (IndexCtrl.GET_DISTANCE > _distancee) {
                        AttackCtrl.attack(_data)
                        break;
                    } else {
                        logger.info(_data);
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
    
    changeBtn: function UN_changeBtn() {
        var _functionName = 'UN_changeBtn',
            _oauthToken = null;

        try {
            Util.startWriteLog(LoginCtrl._className,_functionName);
            // 処理開始
            _oauthToken = localStorage.getItem("oauth_token");
            if (_oauthToken) {
                $('#doTwitterLogout').show();
                $('#doTwitterLogin').hide();
            } else {
                $('#doTwitterLogin').show();
                $('#doTwitterLogout').hide();
            }
            // 処理終了
        }
        catch (ex) {
            logger.error(ex);
        }
        finally {
            Util.endWriteLog(LoginCtrl._className,_functionName);
        }
    },

    photoSendTo: function UN_photoSendTo() {
        var _functionName = 'UN_photoSendTo',
            _file = null,
            _reader;

        try {
            Util.startWriteLog(LoginCtrl._className,_functionName);
            // 処理開始
            _file    = document.querySelector('#fileUpload').files[0];
            _reader  = new FileReader();
          
            _reader.addEventListener("load", function () {
                logger.info(_reader.result); 
        
                $.ajax({	 
                    url: IndexCtrl.urls.setPhoto, // 通信先のURL
                    type:'POST',		// 使用するHTTPメソッド
                    data:{
                        uuid: null,
                        userId: IndexCtrl.userId,
                        lat: IndexCtrl.lat,
                        lng: IndexCtrl.lng,
                        photo: _reader.result,
                    }, // 送信するデータ
                }).done(function(ret, textStatus, jqXHR) {
                    logger.info(ret); //コンソールにJSONが表示される
                }).fail(function(jqXHR, textStatus, errorThrown ) {
                    logger.error(errorThrown);
                }).always(function(){
                //     logger.info('***** 処理終了 *****');
                    $('#fileUpload').val('');  
                });
            }, false);
        
            if (_file) {
                _reader.readAsDataURL(_file);
            }　
            // 処理終了
        }
        catch (ex) {
            logger.error(ex);
        }
        finally {
            Util.endWriteLog(LoginCtrl._className,_functionName);
        }
    },

    dispPhoto: function UN_dispPhoto(lat, lng) {
        var _functionName = 'UN_dispPhoto',
            _distance = 0,
            _pointLat = 0,
            _pointLng = 0,
            _point = [];

        try {
            Util.startWriteLog(IndexCtrl._className,_functionName);
            // 処理開始
            if (IndexCtrl.photos) {
                for (var i = 0; i < IndexCtrl.photos.length; i++) {
                    IndexCtrl.mymap.removeLayer(IndexCtrl.photos[i]);
                }
            }

            IndexCtrl.photos = [];

            $.ajax({	
                url:IndexCtrl.urls.getPhoto, // 通信先のURL
                type:'GET',		// 使用するHTTPメソッド
                data:{
                    userId: null,
                    lat: lat,
                    lng: lng,
                    distance: IndexCtrl.RANGE_DISTANCE /2
                }, // 送信するデータ
                }).done(function(ret,textStatus,jqXHR) {
                    for (var i = 0; i < ret.results.length; i++) {
                        var data = ret.results[i];
                        logger.info(data);
                        _pointLat = doRad(data.location[1]);
                        _pointLng = doRad(data.location[0]);
                        var alpha12 = Math.floor(Math.random() * 359);
                        var length = Math.floor(Math.random() * 50);
                        _point = vincenty(_pointLat, _pointLng, doRad(alpha12), length);

                        var marker = L.marker([_point[0], _point[1]], {icon: IndexCtrl.mapIcon.photo}).addTo(IndexCtrl.mymap)
                        .on('click', function(e) { 
                            // clickイベントの処理 
                            var data = e.target.data;
                            $('#catImage').attr('src', data.url);
                            $('#catView').show();
                        });
                        marker.data = data;
                        IndexCtrl.photos.push(marker);
                    }
                }).fail(function(jqXHR, textStatus, errorThrown ) {
                    logger.error(errorThrown);
                // }).always(function(){
                //     logger.info('***** 処理終了 *****');
                });
            // 処理終了
        }
        catch (ex) {
            logger.error(ex);
        }
        finally {
            Util.endWriteLog(IndexCtrl._className,_functionName);
        }
    },
    
    removePhoto: function UN_removePhoto(uuid) {
        var _functionName = 'UN_removePhoto';

        try {
            Util.startWriteLog(IndexCtrl._className,_functionName);
            // 処理開始
            if(window.confirm('本当に削除しますか？')){
                $.ajax({	
                    url:IndexCtrl.urls.removePhoto, // 通信先のURL
                    type:'POST',		// 使用するHTTPメソッド
                    data:{
                        uuid: uuid,
                        userId: IndexCtrl.userId
                    }, // 送信するデータ
                    }).done(function(ret,textStatus,jqXHR) {
                        logger.info(ret); //コンソールにJSONが表示される
                        IndexCtrl.dispComment(IndexCtrl.rangeLat, IndexCtrl.rangeLng);
                    }).fail(function(jqXHR, textStatus, errorThrown ) {
                        logger.error(errorThrown);
                    }).always(function(){
                        $('#commentView').hide();
                    });
            } else {
                // window.alert('キャンセルされました。');
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

$(document).ready(function(){
    IndexCtrl.init();
});
    
