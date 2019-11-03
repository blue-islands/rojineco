/*
 * タイトル：インデックス画面JS
 * 説明    ：
 * 著作権  ：Copyright(c) 2019 rojineco project.
 * 会社名  ：ロジねこプロジェクト
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
    CHANGE_DISTANCE: 20000,
    RANGE_DISTANCE: 10000,
    GET_DISTANCE: 1000,
    BOUND_ZOOM: 13,
    CATDETECTOR_ITERATION: 'Iteration22',
    WHATCAT_ITERATION: 'Iteration9',
    userId: null,
    photoId: null,
    mymap: null,
    lat: 0,
    lng: 0,
    fixLat: 0,
    fixLng: 0,
    zoom: 0,
    changeLat: 0,
    changeLng: 0,
    rangeLat: 0,
    rangeLng: 0,
    nostalgy: null,
    temple: null,
    park: null,
    myMarker: null,
    nostalgyMarkers: [],
    nostalgyCircle: [],
    templeMarkers: [],
    parkMarkers: [],
    photos: [],
    // photos2: [],
    autoF: true,
    necoF: false,
    shrineF: false,
    templeF: false,
    parkF: false,
    processF: false,
    file: null,
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
        sendTwitter: IndexCtrl.domain + 'sendTwitter',
    },
    mapIcon: {
        my: L.icon({
            iconUrl: './images/walking_man_front.gif',
            iconRetinaUrl: './images/walking_man_front.gif',
            iconSize: [64, 64],
            iconAnchor: [32, 64],
            popupAnchor: [0, -64],
        }),
        myLeft: L.icon({
            iconUrl: './images/walking_man_left.gif',
            iconRetinaUrl: './images/walking_man_left.gif',
            iconSize: [64, 64],
            iconAnchor: [32, 64],
            popupAnchor: [0, -64],
        }),
        myRight: L.icon({
            iconUrl: './images/walking_man_right.gif',
            iconRetinaUrl: './images/walking_man_right.gif',
            iconSize: [64, 64],
            iconAnchor: [32, 64],
            popupAnchor: [0, -64],
        }),
        myBack: L.icon({
            iconUrl: './images/walking_man_back.gif',
            iconRetinaUrl: './images/walking_man_back.gif',
            iconSize: [64, 64],
            iconAnchor: [32, 64],
            popupAnchor: [0, -64],
        }),
        gold1: L.icon({
            iconUrl: './images/cat_sabi.png',
            iconRetinaUrl: './images/cat_sabi.png',
            iconSize: [64, 48],
            iconAnchor: [32, 24],
            popupAnchor: [0, -48],
        }),
        gold2: L.icon({
            iconUrl: './images/cat_tora.png',
            iconRetinaUrl: './images/cat_tora.png',
            iconSize: [64, 48],
            iconAnchor: [32, 24],
            popupAnchor: [0, -48],
        }),
        silver1: L.icon({
            iconUrl: './images/cat_black.png',
            iconRetinaUrl: './images/cat_black.png',
            iconSize: [64, 48],
            iconAnchor: [32, 24],
            popupAnchor: [0, -48],
        }),
        silver2: L.icon({
            iconUrl: './images/cat_kiji.png',
            iconRetinaUrl: './images/cat_kiji.png',
            iconSize: [64, 48],
            iconAnchor: [32, 24],
            popupAnchor: [0, -48],
        }),
        bronze1: L.icon({
            iconUrl: './images/cat_hachi.png',
            iconRetinaUrl: './images/cat_hachi.png',
            iconSize: [64, 48],
            iconAnchor: [32, 24],
            popupAnchor: [0, -48],
        }),
        bronze2: L.icon({
            iconUrl: './images/cat_mike.png',
            iconRetinaUrl: './images/cat_mike.png',
            iconSize: [64, 48],
            iconAnchor: [32, 24],
            popupAnchor: [0, -48],
        }),
        photo: L.icon({
            iconUrl: './images/camera.png',
            iconRetinaUrl: './images/camera.png',
            iconSize: [54, 40],
            iconAnchor: [27, 20],
            popupAnchor: [0, -20],
        }),
        shrine: L.icon({
            iconUrl: './images/shrine.png',
            iconRetinaUrl: './images/shrine.png',
            iconSize: [32, 32],
            iconAnchor: [16, 16],
            popupAnchor: [0, -32],
        }),
        temple: L.icon({
            iconUrl: './images/temple.png',
            iconRetinaUrl: './images/temple.png',
            iconSize: [52, 32],
            iconAnchor: [26, 16],
            popupAnchor: [0, -30],
        }),
        park: L.icon({
            iconUrl: './images/park.png',
            iconRetinaUrl: './images/park.png',
            iconSize: [32, 32],
            iconAnchor: [16, 16],
            popupAnchor: [0, -32],
        }),
    },

    //+----- ↓functionの記述ココから -----------------------------------------------------------------+
    init: function UN_init(authStatus) {
        var _functionName = 'UN_init';

        try {
            Util.startWriteLog(IndexCtrl._className, _functionName);
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

            // Twitterではじめるボタン
            $(document).on('click', '#doTwitterStart', function() {
                // clickイベントの処理
                $('#titleView').hide();
                LoginCtrl.login();
            });

            // タイトル閉じるボタン
            $(document).on('click', '#doTitleClose', function() {
                // clickイベントの処理
                $('#titleView').hide();
            });
            // 自分を中心ボタン
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
                $('#listView').hide();
                $('#photoView').hide();
                IndexCtrl.dispMyPhoto();
            });
            // 写真一覧閉じるボタン
            $(document).on('click', '#doListClose', function() {
                // clickイベントの処理
                $('#listView').hide();
            });
            // 写真撮影ボタン
            $(document).on('click', '#doPhoto', function() {
                // clickイベントの処理
                $('#fileUpload').trigger('click');
            });
            // 写真選択ボタン
            $(document).on('change', '#fileUpload', function() {
                // changeイベントの処理
                IndexCtrl.file = document.querySelector('#fileUpload').files[0];
                var reader = new FileReader();
                reader.addEventListener("load", function() {
                    logger.info(reader.result);
                    $('#settingView').hide();
                    $('#listView').hide();
                    $('#photoView').show();
                    // $('#photoImage').attr('src', './images/l_e_others_501.png');
                    $('#fileUpload').val('');
                    $('#photoImage').attr('src', reader.result)
                }, false);

                if (IndexCtrl.file) {
                    reader.readAsDataURL(IndexCtrl.file);
                }
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
            // 写真撮影撮り直しボタン
            $(document).on('click', '#doPhotoReturn', function() {
                // clickイベントの処理
                $('#fileUpload').trigger('click');
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
            // Twitterに投稿する
            $(document).on('change', '#twitterPost', function() {
                // changeイベントの処理
                var twitterPost = $(this).prop('checked');
                localStorage.setItem("check_twitter", twitterPost);
                // ログイン状態の確認
                IndexCtrl.changeBtn();
            });
            // 神社表示ボタン
            $(document).on('click', '#doShrineOn', function() {
                // clickイベントの処理
                IndexCtrl.dispShrineIcon(false);
            });
            // 神社非表示ボタン
            $(document).on('click', '#doShrineOff', function() {
                // clickイベントの処理
                IndexCtrl.dispShrineIcon(true);
            });
            // お寺表示ボタン
            $(document).on('click', '#doTempleOn', function() {
                // clickイベントの処理
                IndexCtrl.dispTempleIcon(false);
            });
            // お寺非表示ボタン
            $(document).on('click', '#doTempleOff', function() {
                // clickイベントの処理
                IndexCtrl.dispTempleIcon(true);
            });
            // 公園表示ボタン
            $(document).on('click', '#doParkOn', function() {
                // clickイベントの処理
                IndexCtrl.dispParkIcon(false);
            });
            // 公園非表示ボタン
            $(document).on('click', '#doParkOff', function() {
                // clickイベントの処理
                IndexCtrl.dispParkIcon(true);
            });
            // About Usボタン
            $(document).on('click', '#doAbout', function() {
                // clickイベントの処理
                $('#aboutView').show();
            });
            // About Us閉じるボタン
            $(document).on('click', '#doAboutClose', function() {
                // clickイベントの処理
                $('#aboutView').hide();
            });
            // ねこ表示閉じるボタン
            $(document).on('click', '#doCatClose', function() {
                // clickイベントの処理
                $('#catView').hide();
            });
            // 写真削除ボタン
            $(document).on('click', '#doCatDelete', function() {
                // clickイベントの処理
                IndexCtrl.removePhoto();
            });
            // Twitterコメントボタン
            $(document).on('click', '#doTwitterComment', function() {
                // clickイベントの処理
                IndexCtrl.twitterComment();
            });
            // Twitterコメント閉じるボタン
            $(document).on('click', '#doTwitterCommentClose', function() {
                // clickイベントの処理
                $('#twitterCommentView').hide();
            });
            // Twitterに投稿ボタン
            $(document).on('click', '#doTwitterSendTo', function() {
                // clickイベントの処理
                IndexCtrl.twitterSendTo();
            });
            // 地図スワイプ
            $("#mymap").swipe( {
                //Generic swipe handler for all directions
                swipe:function(event, direction, distance, duration, fingerCount, fingerData) {
                    $('#doAuto').html('マップ探索');
                    $('#doAuto').removeClass('is-error');
                    IndexCtrl.autoF = false;
                },
                //Default is 75px, set to 0 for demo so any distance triggers swipe
                threshold:5
            });
            $(document).on('touchmove', '#mymap', function() {
                // touchmoveイベントの処理
                $('#doAuto').html('マップ探索');
                $('#doAuto').removeClass('is-error');
                IndexCtrl.autoF = false;
            });

            // クエリー文字列から指定の写真を取得
            var queryStrings = getUrlVars();
            IndexCtrl.photoId = queryStrings['uuid'];
            IndexCtrl.fixLat = parseFloat(queryStrings['lat']);
            IndexCtrl.fixLng = parseFloat(queryStrings['lng']);

            // 設定ボタンの制御
            IndexCtrl.dispShrineIcon(true);
            IndexCtrl.dispTempleIcon(true);
            IndexCtrl.dispParkIcon(true);

            IndexCtrl.mymap = L.map('mymap', {
                center: [35.7102, 139.8132],
                zoom: 13,
                zoomControl: false, // default true
                preferCanvas: true  //trueとし、Canvasレンダラーを選択
            })

            if(authStatus == 'success') {
                // 認証手続き処理成功時の処理コードをここに記述してください。
                L.tileLayer("https://api-map-pre.mapfan.com/v1/map?key={apikey}&mapstyle=rpg_sp&tilematrix=EPSG:3857:{z}&tilerow={y}&tilecol={x}", {
                    attribution: '&copy; <a href="http://www.incrementp.co.jp/" target="_blank">INCREMENT P CORPORATION</a> | <a href="https://livlog.jp/terms" target="_blank">利用規約</a>',
                    apikey: Mfapi._authAccessKey,
                    maxZoom: 21,
                    minZoom: 6
                }).addTo(IndexCtrl.mymap);
            } else {
                L.tileLayer('https://{s}.tile.thunderforest.com/neighbourhood/{z}/{x}/{y}.png?apikey={apikey}', {
                    attribution: '&copy; <a href="http://www.thunderforest.com/" target="_blank">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors | <a href="https://livlog.jp/terms" target="_blank">利用規約</a>',
                    apikey: 'ed224a20677d4dd1a89710617d85df19',
                    maxZoom: 21,
                    minZoom: 6
                }).addTo(IndexCtrl.mymap);
            }

            // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            //     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            // }).addTo(IndexCtrl.mymap);

            var options = {
                enableHighAccuracy: true,
                timeout: 60000,
                maximumAge: 0
            };
            // 位置情報取得
            window.navigator.geolocation.watchPosition(IndexCtrl.success, IndexCtrl.error, options);
            // 処理終了
        } catch (ex) {
            logger.error(ex);
        } finally {
            Util.endWriteLog(IndexCtrl._className, _functionName);
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
            Util.startWriteLog(IndexCtrl._className, _functionName);
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
            _changeDistance = geolib.getDistance({
                latitude: _lat,
                longitude: _lng
            }, {
                latitude: IndexCtrl.changeLat,
                longitude: IndexCtrl.changeLng
            });
            _rangeDistance = geolib.getDistance({
                latitude: _lat,
                longitude: _lng
            }, {
                latitude: IndexCtrl.rangeLat,
                longitude: IndexCtrl.rangeLng
            });

            // アイコン設定
            if (pos.coords.heading == null) {
                _myIcon = IndexCtrl.mapIcon.my;
            } else if (pos.coords.heading <= 45) {
                _myIcon = IndexCtrl.mapIcon.myBack;
            } else if (45 <= pos.coords.heading && pos.coords.heading <= 135) {
                _myIcon = IndexCtrl.mapIcon.myRight;
            } else if (135 <= pos.coords.heading && pos.coords.heading <= 225) {
                _myIcon = IndexCtrl.mapIcon.my;
            } else if (225 <= pos.coords.heading && pos.coords.heading <= 315) {
                _myIcon = IndexCtrl.mapIcon.myLeft;
            } else if (315 <= pos.coords.heading) {
                _myIcon = IndexCtrl.mapIcon.myBack;
            }

            if (IndexCtrl.myMarker != null) {
                IndexCtrl.mymap.removeLayer(IndexCtrl.myMarker);
            }
            IndexCtrl.myMarker = L.marker([_lat, _lng], {
                icon: _myIcon
            }).addTo(IndexCtrl.mymap);

            // 自分の表示位置を中心に
            if (IndexCtrl.autoF) {
                IndexCtrl.autoMove(_lat, _lng);
            }

            // データ再取得の制御
            if (IndexCtrl.CHANGE_DISTANCE < _changeDistance) {

                $.ajax({
                    url: IndexCtrl.urls.getNostalgy, // 通信先のURL
                    type: 'GET', // 使用するHTTPメソッド
                    data: {
                        lat: _lat,
                        lng: _lng,
                        distance: IndexCtrl.CHANGE_DISTANCE
                    }, // 送信するデータ
                }).done(function(ret, textStatus, jqXHR) {
                    logger.info(ret); //コンソールにJSONが表示される
                    IndexCtrl.changeLat = _lat;
                    IndexCtrl.changeLng = _lng;
                    IndexCtrl.nostalgy = ret.results;
                    IndexCtrl.dispNostalgy(_lat, _lng);
                }).fail(function(jqXHR, textStatus, errorThrown) {
                    logger.error(errorThrown);
                    // }).always(function(){
                    //     logger.info('***** 処理終了 *****');
                });

                $.ajax({
                    url: IndexCtrl.urls.getTemple, // 通信先のURL
                    type: 'GET', // 使用するHTTPメソッド
                    data: {
                        lat: _lat,
                        lng: _lng,
                        distance: IndexCtrl.CHANGE_DISTANCE
                    }, // 送信するデータ
                }).done(function(ret, textStatus, jqXHR) {
                    logger.info(ret); //コンソールにJSONが表示される
                    IndexCtrl.changeLat = _lat;
                    IndexCtrl.changeLng = _lng;
                    IndexCtrl.temple = ret.results;
                    IndexCtrl.dispTemple(_lat, _lng);
                }).fail(function(jqXHR, textStatus, errorThrown) {
                    logger.error(errorThrown);
                    // }).always(function(){
                    //     logger.info('***** 処理終了 *****');
                });

                $.ajax({
                    url: IndexCtrl.urls.getPark, // 通信先のURL
                    type: 'GET', // 使用するHTTPメソッド
                    data: {
                        lat: _lat,
                        lng: _lng,
                        distance: IndexCtrl.CHANGE_DISTANCE
                    }, // 送信するデータ
                }).done(function(ret, textStatus, jqXHR) {
                    logger.info(ret); //コンソールにJSONが表示される
                    IndexCtrl.changeLat = _lat;
                    IndexCtrl.changeLng = _lng;
                    IndexCtrl.park = ret.results;
                    IndexCtrl.dispPark(_lat, _lng);
                }).fail(function(jqXHR, textStatus, errorThrown) {
                    logger.error(errorThrown);
                    // }).always(function(){
                    //     logger.info('***** 処理終了 *****');
                });
            }

            // 表示マーカーの制御
            if ((IndexCtrl.RANGE_DISTANCE / 2) < _rangeDistance) {
                IndexCtrl.dispNostalgy(_lat, _lng);
            }
            if ((IndexCtrl.RANGE_DISTANCE / 4) < _rangeDistance) {
                IndexCtrl.rangeLat = _lat;
                IndexCtrl.rangeLng = _lng;
                IndexCtrl.dispTemple(_lat, _lng);
                IndexCtrl.dispPark(_lat, _lng);
                IndexCtrl.dispPhotoList(_lat, _lng);
            }

            var z = IndexCtrl.mymap.getZoom();
            if (IndexCtrl.zoom != z) {
                IndexCtrl.dispNostalgy(_lat, _lng);
                IndexCtrl.dispTemple(_lat, _lng);
                IndexCtrl.dispPark(_lat, _lng);
            }

            // ねこが近くにいたらアラートを出す。
            IndexCtrl.judgment(_lat, _lng);

            IndexCtrl.zoom = z;
            logger.info("zoom:" + z);
            // 処理終了
        } catch (ex) {
            logger.error(ex);
        } finally {
            Util.endWriteLog(IndexCtrl._className, _functionName);
        }
    },

    error: function UN_error(err) {
        var _functionName = 'UN_error';

        try {
            Util.startWriteLog(IndexCtrl._className, _functionName);
            // 処理開始
            logger.error(err);
            // 処理終了
        } catch (ex) {
            logger.error(ex);
        } finally {
            Util.endWriteLog(IndexCtrl._className, _functionName);
        }
    },

    dispNostalgy: function UN_dispNostalgy(lat, lng) {
        var _functionName = 'UN_dispNostalgy',
            _distance = 0;

        try {
            Util.startWriteLog(IndexCtrl._className, _functionName);
            // 処理開始
            if (IndexCtrl.nostalgy) {
                if (IndexCtrl.nostalgyMarkers) {
                    for (var i = 0; i < IndexCtrl.nostalgyMarkers.length; i++) {
                        IndexCtrl.mymap.removeLayer(IndexCtrl.nostalgyMarkers[i]);
                    }
                }
                if (IndexCtrl.nostalgyCircle) {
                    for (var i = 0; i < IndexCtrl.nostalgyCircle.length; i++) {
                        IndexCtrl.mymap.removeLayer(IndexCtrl.nostalgyCircle[i]);
                    }
                }

                IndexCtrl.nostalgyMarkers = [];
                IndexCtrl.nostalgyCircle = [];

                for (var i = 0; i < IndexCtrl.nostalgy.length; i++) {
                    var data = IndexCtrl.nostalgy[i];
                    _distance = geolib.getDistance({
                        latitude: lat,
                        longitude: lng
                    }, {
                        latitude: data.lat,
                        longitude: data.lng
                    });

                    if (IndexCtrl.RANGE_DISTANCE > _distance) {
                        var marker = L.marker([data.lat, data.lng], {
                            icon: IndexCtrl.rarity(data)
                        }).addTo(IndexCtrl.mymap).bindTooltip('路地裏度:' + data.alleyRatio + '%, ノスタルジー度:' + data.nostalgiaRatio + '%', {
                            direction: 'top',
                            offset: L.point(0, -24)
                        });

                        marker.data = data;
                        IndexCtrl.nostalgyMarkers.push(marker)

                        var z = IndexCtrl.mymap.getZoom();
                        if (IndexCtrl.BOUND_ZOOM <= z) {
                            var circle = L.circle([data.lat, data.lng], {
                                radius: 500,
                                color: '#e61212',
                                fillColor: '#e61212',
                                fillOpacity: 0.1
                            }).addTo(IndexCtrl.mymap);
                            IndexCtrl.nostalgyCircle.push(circle);
                        }
                    }
                }
            }
            // 処理終了
        } catch (ex) {
            logger.error(ex);
        } finally {
            Util.endWriteLog(IndexCtrl._className, _functionName);
        }
    },

    dispTemple: function UN_dispTemple(lat, lng) {
        var _functionName = 'UN_dispTemple',
            _distance = 0;

        try {
            Util.startWriteLog(IndexCtrl._className, _functionName);
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
                    _distance = geolib.getDistance({
                        latitude: lat,
                        longitude: lng
                    }, {
                        latitude: data.location[1],
                        longitude: data.location[0]
                    });

                    if ((IndexCtrl.RANGE_DISTANCE / 2) > _distance) {
                        var z = IndexCtrl.mymap.getZoom();
                        if (IndexCtrl.BOUND_ZOOM <= z) {
                            if (data.genre.includes('神社') && IndexCtrl.shrineF) {
                                var marker = L.marker([data.location[1], data.location[0]], {
                                    icon: IndexCtrl.mapIcon.shrine
                                }).addTo(IndexCtrl.mymap).bindTooltip(data.name, {
                                    direction: 'top',
                                    offset: L.point(0, -16)
                                });
                                marker.data = data;
                                IndexCtrl.templeMarkers.push(marker);
                            } else if (data.genre.includes('寺院') && IndexCtrl.templeF) {
                                var marker = L.marker([data.location[1], data.location[0]], {
                                    icon: IndexCtrl.mapIcon.temple
                                }).addTo(IndexCtrl.mymap).bindTooltip(data.name, {
                                    direction: 'top',
                                    offset: L.point(0, -16)
                                });
                                marker.data = data;
                                IndexCtrl.templeMarkers.push(marker);
                            } else if (data.genre.includes('教会')) {
                                // var marker = L.marker([data.location[1], data.location[0]], {icon: IndexCtrl.mapIcon.temple}).addTo(IndexCtrl.mymap);
                                // marker.data = data;
                                // IndexCtrl.templeMarkers.push(marker);
                            }
                        }
                    }
                }
            }
            // 処理終了
        } catch (ex) {
            logger.error(ex);
        } finally {
            Util.endWriteLog(IndexCtrl._className, _functionName);
        }
    },

    dispPark: function UN_dispPark(lat, lng) {
        var _functionName = 'UN_dispPark',
            _distance = 0;

        try {
            Util.startWriteLog(IndexCtrl._className, _functionName);
            // 処理開始
            if (IndexCtrl.park) {
                if (IndexCtrl.parkMarkers) {
                    for (var i = 0; i < IndexCtrl.parkMarkers.length; i++) {
                        IndexCtrl.mymap.removeLayer(IndexCtrl.parkMarkers[i]);
                    }
                }

                IndexCtrl.parkMarkers = [];

                var z = IndexCtrl.mymap.getZoom();
                for (var i = 0; i < IndexCtrl.park.length; i++) {
                    var data = IndexCtrl.park[i];
                    _distance = geolib.getDistance({
                        latitude: lat,
                        longitude: lng
                    }, {
                        latitude: data.location[1],
                        longitude: data.location[0]
                    });
                    if ((IndexCtrl.RANGE_DISTANCE / 2) > _distance) {
                        var z = IndexCtrl.mymap.getZoom();
                        if (IndexCtrl.BOUND_ZOOM <= z && IndexCtrl.parkF) {
                            var marker = L.marker([data.location[1], data.location[0]], {
                                icon: IndexCtrl.mapIcon.park
                            }).addTo(IndexCtrl.mymap).bindTooltip(data.name, {
                                direction: 'top',
                                offset: L.point(0, -16)
                            });
                            marker.data = data;
                            IndexCtrl.parkMarkers.push(marker);
                        }
                    }
                }
            }
            // 処理終了
        } catch (ex) {
            logger.error(ex);
        } finally {
            Util.endWriteLog(IndexCtrl._className, _functionName);
        }
    },

    dispSize: function UN_dispSize() {
        var _functionName = 'UN_dispSize',
            // _navbarHeight,
            _windowHeight;

        try {
            Util.startWriteLog(IndexCtrl._className, _functionName);
            // 処理開始
            // _navbarHeight = $('.navbar').height();
            _windowHeight = $(window).height();
            $('body').height(_windowHeight);
            // 処理終了
        } catch (ex) {
            logger.error(ex);
        } finally {
            Util.endWriteLog(IndexCtrl._className, _functionName);
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
            Util.startWriteLog(IndexCtrl._className, _functionName);
            // 処理開始
            if (IndexCtrl.nostalgy == null) {
                return;
            }

            for (var i = 0; i < IndexCtrl.nostalgy.length; i++) {
                var data = IndexCtrl.nostalgy[i];
                _distance = geolib.getDistance({
                    latitude: lat,
                    longitude: lng
                }, {
                    latitude: data.lat,
                    longitude: data.lng
                });
                _distanceAry.push(_distance);
            }
            _min = Math.min.apply(null, _distanceAry);
            _lat = doRad(lat);
            _lng = doRad(lng);
            _up = vincenty(_lat, _lng, doRad(0), _min);
            _right = vincenty(_lat, _lng, doRad(90), _min);
            _down = vincenty(_lat, _lng, doRad(180), _min);
            _left = vincenty(_lat, _lng, doRad(270), _min);
            _bounds = geolib.getBounds([{
                    latitude: _up[0],
                    longitude: _up[1]
                },
                {
                    latitude: _right[0],
                    longitude: _right[1]
                },
                {
                    latitude: _down[0],
                    longitude: _down[1]
                },
                {
                    latitude: _left[0],
                    longitude: _left[1]
                },
            ]);

            logger.info(_bounds.minLat + ',' + _bounds.maxLng);
            logger.info(_bounds.maxLat + ',' + _bounds.minLng);
            IndexCtrl.mymap.setView([lat, lng]); //地図を移動
            IndexCtrl.mymap.fitBounds([
                [_bounds.minLat, _bounds.maxLng],
                [_bounds.maxLat, _bounds.minLng]
            ]);
            // 処理終了
        } catch (ex) {
            logger.error(ex);
        } finally {
            Util.endWriteLog(IndexCtrl._className, _functionName);
        }
    },

    rarity: function UN_rarity(data) {
        var _functionName = 'UN_rarity',
            _point = 0;

        try {
            Util.startWriteLog(IndexCtrl._className, _functionName);
            // 処理開始
            _point = data.nostalgiaRatio + data.alleyRatio;
            if (180 <= _point) {
                return IndexCtrl.mapIcon.gold1;
            } else if (140 <= _point) {
                return IndexCtrl.mapIcon.gold2;
            } else if (100 <= _point) {
                return IndexCtrl.mapIcon.silver1;
            } else if (60 <= _point) {
                return IndexCtrl.mapIcon.silver2;
            } else if (20 <= _point) {
                return IndexCtrl.mapIcon.bronze1;
            } else {
                return IndexCtrl.mapIcon.bronze2;
            }
            // 処理終了
        } catch (ex) {
            logger.error(ex);
        } finally {
            Util.endWriteLog(IndexCtrl._className, _functionName);
        }
    },

    auto: function UN_auto() {
        var _functionName = 'UN_auto';

        try {
            Util.startWriteLog(IndexCtrl._className, _functionName);
            // 処理開始
            IndexCtrl.autoF
            if (IndexCtrl.autoF) {
                $('#doAuto').html('マップ探索');
                $('#doAuto').removeClass('is-error');
                IndexCtrl.autoF = false;
            } else {
                $('#doAuto').html('自分を中心');
                $('#doAuto').addClass('is-error');
                IndexCtrl.autoF = true;
            }
            // 処理終了
        } catch (ex) {
            logger.error(ex);
        } finally {
            Util.endWriteLog(IndexCtrl._className, _functionName);
        }
    },

    judgment: function UN_judgment(lat, lng) {
        var _functionName = 'UN_judgment',
            _nostalgyMarkers = null,
            _data = null,
            _distance = 0,
            _flg = false;

        try {
            Util.startWriteLog(IndexCtrl._className, _functionName);
            // 処理開始
            // 多重アクセスを防ぐ
            if (!IndexCtrl.processF) {
                IndexCtrl.processF = true;
                if (IndexCtrl.nostalgyMarkers) {
                    for (var i = 0; i < IndexCtrl.nostalgyMarkers.length; i++) {
                        _nostalgyMarkers = IndexCtrl.nostalgyMarkers[i];
                        _data = _nostalgyMarkers.data;
                        _distancee = geolib.getDistance({
                            latitude: lat,
                            longitude: lng
                        }, {
                            latitude: _data.lat,
                            longitude: _data.lng
                        });
                        // 指定の範囲内に現れたら戦闘画面を表示
                        if (IndexCtrl.GET_DISTANCE > _distancee) {
                            _flg = true;
                            break;
                        }
                    }
                }

                if (IndexCtrl.necoF != _flg) {
                    if (_flg) {
                        // alert('近くでねこの匂いがしますね。。。');
                        toastr.success('近くでねこの匂いがしますね。。。');
                    }
                }
                IndexCtrl.necoF = _flg;
                IndexCtrl.processF = false;
            }
            // 処理終了
        } catch (ex) {
            logger.error(ex);
        } finally {
            Util.endWriteLog(IndexCtrl._className, _functionName);
        }
    },

    changeBtn: function UN_changeBtn() {
        var _functionName = 'UN_changeBtn',
            _oauthToken = null;

        try {
            Util.startWriteLog(IndexCtrl._className, _functionName);
            // 処理開始
            _oauthToken = localStorage.getItem("oauth_token");
            if (_oauthToken) {
                $('#doTwitterLogout').show();
                $('#doTwitterLogin').hide();
                $('#dispTwitter').show();
            } else {
                $('#doTwitterLogin').show();
                $('#doTwitterLogout').hide();
                $('#dispTwitter').hide();
            }
            // ツイッター投稿の値設定
            var checkTwitter = localStorage.getItem("check_twitter");
            $('#twitterPost').prop("checked", parseStrToBoolean(checkTwitter));
            // 処理終了
        } catch (ex) {
            logger.error(ex);
        } finally {
            Util.endWriteLog(IndexCtrl._className, _functionName);
        }
    },

    photoSendTo: function UN_photoSendTo() {
        var _functionName = 'UN_photoSendTo',
            _file = null,
            _reader;

        try {
            Util.startWriteLog(IndexCtrl._className, _functionName);
            // 処理開始
            _file = IndexCtrl.file;
            _reader = new FileReader();

            _reader.addEventListener("load", function() {
                logger.info(_reader.result);

                // Resize Base64 Image
                Util.imgB64Resize(_reader.result, function(imgB64) {
                    // Destination Image
                    // var checkTwitter = localStorage.getItem("check_twitter");
                    var oauthToken = null;
                    var oauthTokenSecret = null;
                    // if (parseStrToBoolean(checkTwitter)) {
                    //     oauthToken = localStorage.getItem("oauth_token");
                    //     oauthTokenSecret = localStorage.getItem("oauth_token_secret");
                    // }
                    var lat = IndexCtrl.lat;
                    var lng = IndexCtrl.lng;
                    if (!isNaN(IndexCtrl.fixLat) || !isNaN(IndexCtrl.fixLng)) {
                        lat = IndexCtrl.fixLat;
                        lng = IndexCtrl.fixLng;
                    } 

                    $.ajax({
                        url: IndexCtrl.urls.setPhoto, // 通信先のURL
                        type: 'POST', // 使用するHTTPメソッド
                        data: {
                            uuid: null,
                            userId: IndexCtrl.userId,
                            oauthToken: oauthToken,
                            oauthTokenSecret: oauthTokenSecret,
                            lat: lat,
                            lng: lng,
                            catDetector: IndexCtrl.CATDETECTOR_ITERATION,
                            whatCat: IndexCtrl.WHATCAT_ITERATION,
                            photo: imgB64,
                        }, // 送信するデータ
                    }).done(function(ret, textStatus, jqXHR) {
                        logger.info(ret); //コンソールにJSONが表示される
                        if (ret.status == 1) {
                            IndexCtrl.dispPhotoList(IndexCtrl.lat, IndexCtrl.lng);
                            // alert('写真を登録しました。');
                            toastr.success('写真を登録しました。');
                        } else {
                            // alert(ret.messages[0]);
                            toastr.success(ret.messages[0]);
                        }
                    }).fail(function(jqXHR, textStatus, errorThrown) {
                        logger.error(errorThrown);
                        alert('エラーが発生しました。');
                    }).always(function() {
                        //     logger.info('***** 処理終了 *****');
                        $('#fileUpload').val('');
                        IndexCtrl.progressBar(false);
                    });
                });

            }, false);

            if (_file) {
                _reader.readAsDataURL(_file);
                $('#photoView').hide();
                IndexCtrl.progressBar(true);
            }
            IndexCtrl.file = null;
            // 処理終了
        } catch (ex) {
            logger.error(ex);
        } finally {
            Util.endWriteLog(IndexCtrl._className, _functionName);
            $('#photoView').hide();
        }
    },

    dispPhotoList: function UN_dispPhotoList(lat, lng) {
        var _functionName = 'UN_dispPhotoList',
            _userId = null,
            _photoId = null,
            _pointLat = 0,
            _pointLng = 0,
            _point = [];

        try {
            Util.startWriteLog(IndexCtrl._className, _functionName);
            // 処理開始
            if (IndexCtrl.photos) {
                for (var i = 0; i < IndexCtrl.photos.length; i++) {
                    IndexCtrl.mymap.removeLayer(IndexCtrl.photos[i]);
                }
            }

            // ユーザーIDの取得
            _userId = IndexCtrl.userId;
            _photoId = IndexCtrl.photoId;

            IndexCtrl.photos = [];

            $.ajax({
                url: IndexCtrl.urls.getPhoto, // 通信先のURL
                type: 'GET', // 使用するHTTPメソッド
                data: {
                    userId: _userId,
                    lat: lat,
                    lng: lng,
                    distance: IndexCtrl.RANGE_DISTANCE,
                    photoId: _photoId
                }, // 送信するデータ
            }).done(function(ret, textStatus, jqXHR) {
                for (var i = 0; i < ret.results.length; i++) {
                    var data = ret.results[i];
                    logger.info(data);
                    _pointLat = doRad(data.location[1]);
                    _pointLng = doRad(data.location[0]);
                    var alpha12 = Math.floor(Math.random() * 359);
                    var length = Math.floor(Math.random() * 50);
                    _point = vincenty(_pointLat, _pointLng, doRad(alpha12), length);

                    var marker = L.marker([_point[0], _point[1]], {
                            icon: IndexCtrl.mapIcon.photo
                        }).addTo(IndexCtrl.mymap)
                        .on('click', function(e) {
                            // clickイベントの処理
                            var data = e.target.data;
                            IndexCtrl.dispPhotoDetail(null, data);
                        });
                    marker.data = data;
                    IndexCtrl.photos.push(marker);
                }

                // ねこの指定があった場合はここで表示する
                if (IndexCtrl.photoId != null) {
                    IndexCtrl.dispPhotoDetail(IndexCtrl.photoId, null);
                    IndexCtrl.photoId = null;
                }

            }).fail(function(jqXHR, textStatus, errorThrown) {
                logger.error(errorThrown);
                // }).always(function(){
                //     logger.info('***** 処理終了 *****');
            });
            // 処理終了
        } catch (ex) {
            logger.error(ex);
        } finally {
            Util.endWriteLog(IndexCtrl._className, _functionName);
        }
    },

    dispMyPhoto: function UN_dispMyPhoto() {
        var _functionName = 'UN_dispMyPhoto';

        try {
            Util.startWriteLog(IndexCtrl._className, _functionName);
            // 処理開始

            $.ajax({
                url: IndexCtrl.urls.getPhotoList, // 通信先のURL
                type: 'GET', // 使用するHTTPメソッド
                data: {
                    userId: IndexCtrl.userId
                }, // 送信するデータ
            }).done(function(ret, textStatus, jqXHR) {

                if (ret.results.length == 0) {
                    // alert('まだ、ねこを撮影していません。');
                    toastr.success('まだ、ねこを撮影していません。');
                    return;
                }

                $('#listView').show();
                var html = '';
                // IndexCtrl.photos2 = ret.results;
                for (var i = 0; i < ret.results.length; i++) {
                    var data = ret.results[i];
                    logger.info(data);
                    if (i % 2 == 0) {
                        html += '<tr>';
                        html += '<td align="center" valign="middle" style="width: 120px;">';
                        html += '<a onclick="IndexCtrl.dispPhotoDetail(\'' + data.uuid +  '\', null)">';
                        html += '<span style="display: block;height: 0;width: 100%;padding-bottom: 100%;'
                        html += 'background: url(\'' + data.url + '\');';
                        html += 'background-size: cover;';
                        html += 'background-position: center;';
                        html += '"></span>'
                        html += '</a>';
                        html += '</td>';
                    } else {
                        html += '<td align="center" valign="middle" style="width: 120px;">';
                        html += '<a onclick="IndexCtrl.dispPhotoDetail(\'' + data.uuid +  '\', null)">';
                        html += '<span style="display: block;height: 0;width: 100%;padding-bottom: 100%;'
                        html += 'background: url(\'' + data.url + '\');';
                        html += 'background-size: cover;';
                        html += 'background-position: center;';
                        html += '"></span>'
                        html += '</a>';
                        html += '</td>';
                        html += '</tr>';
                    }
                }

                if (ret.results.length % 2 != 0) {
                    html += '<td style="width: 120px;"></td>';
                    html += '</tr>';
                }

                $('#photoList').html(html);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                logger.error(errorThrown);
                // }).always(function(){
                //     logger.info('***** 処理終了 *****');
            });
            // 処理終了
        } catch (ex) {
            logger.error(ex);
        } finally {
            Util.endWriteLog(IndexCtrl._className, _functionName);
        }
    },

    dispPhotoDetail: function UN_dispPhotoDetail(uuid, data) {
        var _functionName = 'UN_dispPhotoDetail';

        try {
            Util.startWriteLog(IndexCtrl._className, _functionName);
            // 処理開始
            if (uuid) {
                for( var val in IndexCtrl.photos) {
                    var photo = IndexCtrl.photos[val];
                    if (uuid == photo.data.uuid) {
                        data = photo.data;
                        break;
                    }
                }
            }

            $('#catImage').attr('src', data.url);
            if (data.cats == null || data.cats.length == 0) {
                $('#catName').text('不明');
            } else {
                IndexCtrl.getCatName(data.cats[0].name);
            }

            if (data.address == null) {
                $('#address').text('住所不定');
            } else {
                $('#address').text(data.address);
            }

            if (data.userId == IndexCtrl.userId) {
                $('#doCatDelete').show();
                var checkTwitter = localStorage.getItem("check_twitter");
                if (parseStrToBoolean(checkTwitter)) {
                    $('#doTwitterComment').show();
                } else {
                    $('#doTwitterComment').hide();      
                }
            } else {
                $('#doCatDelete').hide();
                $('#doTwitterComment').hide();
            }

            $('#photoId').val(data.uuid);
            $('#titleView').hide();
            $('#doAuto').html('マップ探索');
            $('#doAuto').removeClass('is-error');
            IndexCtrl.autoF = false;
            IndexCtrl.mymap.setView([data.location[1], data.location[0]]); //地図を移動
            // IndexCtrl.mymap.setZoom(16);
            $('#catView').show();
            // 処理終了
        } catch (ex) {
            logger.error(ex);
        } finally {
            Util.endWriteLog(IndexCtrl._className, _functionName);
        }
    },

    removePhoto: function UN_removePhoto() {
        var _functionName = 'UN_removePhoto';

        try {
            Util.startWriteLog(IndexCtrl._className, _functionName);
            // 処理開始
            if (window.confirm('本当に削除しますか？')) {
                $.ajax({
                    url: IndexCtrl.urls.removePhoto, // 通信先のURL
                    type: 'POST', // 使用するHTTPメソッド
                    data: {
                        uuid: $('#photoId').val(),
                        userId: IndexCtrl.userId
                    }, // 送信するデータ
                }).done(function(ret, textStatus, jqXHR) {
                    logger.info(ret); //コンソールにJSONが表示される
                    IndexCtrl.dispPhotoList(IndexCtrl.lat, IndexCtrl.lng);
                }).fail(function(jqXHR, textStatus, errorThrown) {
                    logger.error(errorThrown);
                }).always(function() {
                    $('#catView').hide();
                    $('#listView').hide();
                    // alert('ねこ写真を削除しました。');
                    toastr.success('ねこ写真を削除しました。');
                });
            } else {
                // window.alert('キャンセルされました。');
            }
            // 処理終了
        } catch (ex) {
            logger.error(ex);
        } finally {
            Util.endWriteLog(IndexCtrl._className, _functionName);
        }
    },

    dispShrineIcon: function UN_dispShrineIcon(dispF) {
        var _functionName = 'UN_dispShrineIcon';

        try {
            Util.startWriteLog(IndexCtrl._className, _functionName);
            // 処理開始
            if (dispF) {
                $('#doShrineOn').show();
                $('#doShrineOff').hide();
                IndexCtrl.shrineF = true;
            } else {
                $('#doShrineOff').show();
                $('#doShrineOn').hide();
                IndexCtrl.shrineF = false;
            }
            IndexCtrl.zoom = 0;
            // 処理終了
        } catch (ex) {
            logger.error(ex);
        } finally {
            Util.endWriteLog(IndexCtrl._className, _functionName);
        }
    },

    dispTempleIcon: function UN_dispTempleIcon(dispF) {
        var _functionName = 'UN_dispTempleIcon';

        try {
            Util.startWriteLog(IndexCtrl._className, _functionName);
            // 処理開始
            if (dispF) {
                $('#doTempleOn').show();
                $('#doTempleOff').hide();
                IndexCtrl.templeF = true;
            } else {
                $('#doTempleOff').show();
                $('#doTempleOn').hide();
                IndexCtrl.templeF = false;
            }
            IndexCtrl.zoom = 0;
            // 処理終了
        } catch (ex) {
            logger.error(ex);
        } finally {
            Util.endWriteLog(IndexCtrl._className, _functionName);
        }
    },

    dispParkIcon: function UN_dispParkIcon(dispF) {
        var _functionName = 'UN_dispParkIcon';

        try {
            Util.startWriteLog(IndexCtrl._className, _functionName);
            // 処理開始
            if (dispF) {
                $('#doParkOn').show();
                $('#doParkOff').hide();
                IndexCtrl.parkF = true;
            } else {
                $('#doParkOff').show();
                $('#doParkOn').hide();
                IndexCtrl.parkF = false;
            }
            IndexCtrl.zoom = 0;
            // 処理終了
        } catch (ex) {
            logger.error(ex);
        } finally {
            Util.endWriteLog(IndexCtrl._className, _functionName);
        }
    },

    getCatName: function UN_getCatName(id) {
        var _functionName = 'UN_getCatName';

        try {
            Util.startWriteLog(IndexCtrl._className, _functionName);
            // 処理開始
            if ('white_cat' == id) {
                // 白猫(white_cat)
                $('#catName').text('白猫');
            } else if ('black_cat' == id) {
                // 黒猫(black_cat)
                $('#catName').text('黒猫');
            } else if ('calico_cat' == id) {
                // 三毛猫(calico_cat)
                $('#catName').text('三毛猫');
            } else if ('rust_cat' == id) {
                // サビ猫(rust_cat)
                $('#catName').text('サビ猫');
            } else if ('tiger_cat' == id) {
                // トラ猫(tiger_cat)
                $('#catName').text('トラ猫');
            } else if ('spotted_cat' == id) {
                // ブチ猫(spotted_cat)
                $('#catName').text('ブチ猫');
            } else {
                $('#catName').text('不明');
            }
            // 処理終了
        } catch (ex) {
            logger.error(ex);
        } finally {
            Util.endWriteLog(IndexCtrl._className, _functionName);
        }
    },

    progressId: 0,
    progressBar: function UN_progressBar(flg) {
        var _functionName = 'UN_progressBar';

        try {
            Util.startWriteLog(IndexCtrl._className, _functionName);
            // 処理開始
            if (flg) {
                $('#progressView').show();
                var count = 0;
                var countup = function(){
                    //console.log(count++);
                    //<progress class="nes-progress is-primary" value="80" max="100"></progress>
                    $('#progress').val(count);
                    count++
                } 
                IndexCtrl.progressId = setInterval(countup, 50);

            } else {
                $('#progressView').hide();
                clearInterval(IndexCtrl.progressId);
            }
            // 処理終了
        } catch (ex) {
            logger.error(ex);
        } finally {
            Util.endWriteLog(IndexCtrl._className, _functionName);
        }
    },

    twitterSendTo: function UN_twitterSendTo() {
        var _functionName = 'UN_twitterSendTo'

        try {
            Util.startWriteLog(IndexCtrl._className, _functionName);
            // 処理開始
            if (window.confirm('Twitterに投稿しますか？')) {
                IndexCtrl.progressBar(true);
                var checkTwitter = localStorage.getItem("check_twitter");
                var oauthToken = null;
                var oauthTokenSecret = null;
                if (parseStrToBoolean(checkTwitter)) {
                    oauthToken = localStorage.getItem("oauth_token");
                    oauthTokenSecret = localStorage.getItem("oauth_token_secret");
                }
                var uuid = $('#photoId').val();
                var comment = $('#comment').val();
    
                $.ajax({
                    url: IndexCtrl.urls.sendTwitter, // 通信先のURL
                    type: 'POST', // 使用するHTTPメソッド
                    data: {
                        uuid: uuid,
                        userId: IndexCtrl.userId,
                        comment: comment,
                        oauthToken: oauthToken,
                        oauthTokenSecret: oauthTokenSecret,
                    }, // 送信するデータ
                }).done(function(ret, textStatus, jqXHR) {
                    logger.info(ret); //コンソールにJSONが表示される
                    if (ret.status == 1) {
                        IndexCtrl.dispPhotoList(IndexCtrl.lat, IndexCtrl.lng);
                        // alert('Twitterに投稿しました。');
                        toastr.success('Twitterに投稿しました。');
                    } else {
                        // alert(ret.messages[0]);
                        toastr.success(ret.messages[0]); 
                    }
                }).fail(function(jqXHR, textStatus, errorThrown) {
                    logger.error(errorThrown);
                    alert('エラーが発生しました。');
                }).always(function() {
                    //     logger.info('***** 処理終了 *****');
                    // $('#catView').hide();
                    $('#twitterCommentView').hide();
                    IndexCtrl.progressBar(false);
                });
            }
            // 処理終了
        } catch (ex) {
            logger.error(ex);
        } finally {
            Util.endWriteLog(IndexCtrl._className, _functionName);
            $('#photoView').hide();
        }
    },

    twitterComment: function UN_twitterComment() {
        var _functionName = 'UN_twitterComment',
            _uuid = '',
            _catName = '',
            _address = '',
            _comment ='';

        try {
            Util.startWriteLog(IndexCtrl._className, _functionName);
            // 処理開始
            _uuid = $('#photoId').val();
            _address = $('#address').text();
            _catName = $('#catName').text();
            _comment += _address + 'で';
            _comment += _catName + 'を';
            _comment += '発見！\n';
            _comment += 'ねこ情報はこちら → https://rojine.co?uuid=' + _uuid + '\n';
            _comment += '\n';
            _comment += 'ロジねこアプリはこちら → https://rojine.co' + '\n';
            _comment += "#ロジねこ #猫好きさんと繋がりたい";

            $('#comment').val(_comment);
            $('#twitterCommentView').show();
            // 処理終了
        } catch (ex) {
            logger.error(ex);
        } finally {
            Util.endWriteLog(IndexCtrl._className, _functionName);
            $('#photoView').hide();
        }
    },
};

$(document).ready(function() {
    
    // ビューの非表示
    $('#settingView').hide();
    $('#listView').hide();
    $('#photoView').hide();
    $('#catView').hide();
    $('#aboutView').hide();
    $('#twitterCommentView').hide();
    $('#progressView').hide();

    //### サーバ名設定 ###
    // 利用する地図APIサーバ名を設定します。
    // なお、このサンプルではテスト利用サーバー名を設定しています。
    Mfapi.mapHost = 'api-map-pre.mapfan.com';

    //### 認証リクエスト処理 ###
    // 認証APIの実行要求を行います。
    // 第１パラメータには、お客様専用に発行した顧客IDを設定します。
    // 第２パラメータには、認証手続き完了後に呼び出すコールバック関数を設定します。
    // ※ appidはお客様の認証ＩＤを設定してください。
    var appid = '5375a40a0e635b3145726775dad47fb732a6fae203d61bdb'
    Mfapi.auth(appid, IndexCtrl.init);
});

toastr.options = {
    "closeButton": false,
    "debug": false,
    "newestOnTop": false,
    "progressBar": false,
    "positionClass": "toast-top-center",
    "preventDuplicates": true,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
}