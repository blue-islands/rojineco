/*
 * タイトル：インデックス画面JS
 * 説明    ：
 * 著作権  ：Copyright(c) 2018 LivLog llc.
 * 会社名  ：リブログ合同会社
 * 変更履歴：2019.05.16
 *        ：新規登録
 */
//34567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890
var IndexCtrl = {};
//+----- ↓定数・変数の設定ココから -----------------------------------------------------------------+
IndexCtrl.domain = 'https://www.livlog.xyz/webapi/';
// IndexCtrl.domain = 'http://localhost:8080/';
IndexCtrl = {
    _className: 'IndexCtrl',
    SESSION_UUID: "SESSION_UUID",
    CHANGE_DISTANCE: 50000,
    RANGE_DISTANCE: 20000,
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
    myMarker: null,
    markers:[],
    autoF: true,
    urls: {
        login: IndexCtrl.domain + 'login',
        who: IndexCtrl.domain + 'who',
        getNostalgy: IndexCtrl.domain + 'getNostalgy',
        setComment: IndexCtrl.domain + 'setComment',
    },
    mapIcon: {
        my: L.icon({
            iconUrl: 'https://rojine.co/img/8-bit-mario-icon-13.png',
            iconRetinaUrl: 'https://rojine.co/img/8-bit-mario-icon-13.png',
            iconSize: [24, 24],
            iconAnchor: [12, 24],
            popupAnchor: [0, -24],
        }),
        gold: L.icon({
            iconUrl: 'https://rojine.co/img/8-bit-mario-icon-7.png',
            iconRetinaUrl: 'https://rojine.co/img/8-bit-mario-icon-7.png',
            iconSize: [24, 24],
            iconAnchor: [12, 24],
            popupAnchor: [0, -24],
        }),
        silver: L.icon({
            iconUrl: 'https://rojine.co/img/8-bit-mario-icon-14.png',
            iconRetinaUrl: 'https://rojine.co/img/8-bit-mario-icon-14.png',
            iconSize: [24, 24],
            iconAnchor: [12, 24],
            popupAnchor: [0, -24],
        }),
        bronze: L.icon({
            iconUrl: 'https://rojine.co/img/8-bit-mario-icon-15.png',
            iconRetinaUrl: 'https://rojine.co/img/8-bit-mario-icon-15.png',
            iconSize: [24, 24],
            iconAnchor: [12, 24],
            popupAnchor: [0, -24],
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
            });
            // 状態ボタン
            $(document).on('click', '#doStatus', function() {
                // clickイベントの処理
            });
            // コメントボタン
            $(document).on('click', '#doComment', function() {
                // clickイベントの処理
                $('#commentView').show();
                $('#commentField').removeClass('is-error');
                $('#commentField').val('');
            });
            // コメント登録ボタン
            $(document).on('click', '#doCommentEntry', function() {
                // clickイベントの処理
                var uuid = null;
                var comment = $('#commentField').val();
                if (comment.length == 0) {
                    $('#commentField').addClass('is-error');     
                } else {
                    IndexCtrl.comment(uuid, comment);
                }
            });
            // コメントキャンセルボタン
            $(document).on('click', '#doCommentCancel', function() {
                // clickイベントの処理
                $('#commentView').hide();
            });
            
            // ビューの非表示
            $('#commentView').hide();
            $('#catView').hide();

            IndexCtrl.mymap = L.map('mymap',{
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
                IndexCtrl.rangeLat = _lat;
                IndexCtrl.rangeLng = _lng;
                IndexCtrl.dispMarker(_lat, _lng);
            }

            // データ再取得の制御
            if (IndexCtrl.CHANGE_DISTANCE < _changeDistance) {
                // 1.$.ajaxメソッドで通信を行います。
                //  20行目のdataは、フォームの内容をserialize()している
                //  →serialize()の内容は、cs1=custom1&cs2=custom2
                $.ajax({	
                    url:IndexCtrl.urls.getNostalgy, // 通信先のURL
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
                        IndexCtrl.changeLat = _lat;
                        IndexCtrl.changeLng = _lng;
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
            _distance = 0,
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

                IndexCtrl.markers = [];

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

    autoMove: function UN_appearance(lat, lng) {
        var _functionName = 'UN_appearance',
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
        var _functionName = 'UN_rarity';

        try {
            Util.startWriteLog(IndexCtrl._className,_functionName);
            // 処理開始
            if (15 >= data.nostalgiaRatio) {
                return IndexCtrl.mapIcon.gold;
            } else if (30 >= data.nostalgiaRatio) {
                return IndexCtrl.mapIcon.silver;
            } else {
                return IndexCtrl.mapIcon.bronze;
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

    comment: function UN_comment(uuid, comment) {
        var _functionName = 'UN_comment';

        try {
            Util.startWriteLog(IndexCtrl._className,_functionName);
            // 処理開始
            $.ajax({	
                url:IndexCtrl.urls.setComment, // 通信先のURL
                type:'POST',		// 使用するHTTPメソッド
                data:{
                    uuid: uuid,
                    userId: IndexCtrl.userId,
                    lat: IndexCtrl.lat,
                    lng: IndexCtrl.lng,
                    comment: comment
                }, // 送信するデータ
                // 2. doneは、通信に成功した時に実行される
                //  引数のdata1は、通信で取得したデータ
                //  引数のtextStatusは、通信結果のステータス
                //  引数のjqXHRは、XMLHttpRequestオブジェクト
                }).done(function(ret,textStatus,jqXHR) {
                    logger.info(ret); //コンソールにJSONが表示される

                // 6. failは、通信に失敗した時に実行される
                }).fail(function(jqXHR, textStatus, errorThrown ) {
                    logger.error(errorThrown);
                // 7. alwaysは、成功/失敗に関わらず実行される
                }).always(function(){
                    $('#commentView').hide();
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

    judgment: function UN_judgment() {
        var _functionName = 'UN_judgment',
            _markers = null,
            _data = null,
            _distance = 0;

        try {
            Util.startWriteLog(IndexCtrl._className,_functionName);
            // 処理開始
            if (IndexCtrl.markers) {
                for (var i = 0; i < IndexCtrl.markers.length; i++) {
                    _markers = IndexCtrl.markers[i];
                    _data = _markers.data;
                    _distancee = geolib.getDistance(
                        {latitude: IndexCtrl.lat, longitude: IndexCtrl.lng},
                        {latitude: _data.lat, longitude: _data.lng}
                    );
                    // 指定の範囲内に現れたら戦闘画面を表示
                    if (IndexCtrl.GET_DISTANCE > _distancee) {
                        alert('ネコが現れた');
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
};

$(document).ready(function(){
    IndexCtrl.init();
});
    
