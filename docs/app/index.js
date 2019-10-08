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
// IndexCtrl.domain = 'http://localhost:8080/';
IndexCtrl = {
    _className: 'IndexCtrl',
    SESSION_UUID: "SESSION_UUID",
    CHANGE_DISTANCE: 20000,
    RANGE_DISTANCE: 10000,
    GET_DISTANCE: 1000,
    BOUND_ZOOM: 13,
    userId: null,
    mymap: null,
    lat: 0,
    lng: 0,
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
    photos2: [],
    autoF: true,
    necoF: false,
    shrineF: false,
    templeF: false,
    parkF: false,
    processF: false,
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
            iconSize: [31, 30],
            iconAnchor: [15, 15],
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
    init: function UN_init() {
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

            // タイトル閉じるボタン
            $(document).on('click', '#doTitleClose', function() {
                // clickイベントの処理
                $('#titleView').hide();
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
                $('#listView').hide();
                $('#photoView').hide();
                IndexCtrl.dispPhotoList();
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
                $('#photoImage').attr('src', './images/l_e_others_501.png');
                $('#fileUpload').val('');
            });
            // 写真選択ボタン
            $(document).on('change', '#fileUpload', function() {
                // changeイベントの処理
                var file = document.querySelector('#fileUpload').files[0];
                var reader = new FileReader();
                reader.addEventListener("load", function() {
                    logger.info(reader.result);
                    $('#photoImage').attr('src', reader.result)
                }, false);

                if (file) {
                    reader.readAsDataURL(file);
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
            // ネコ表示閉じるボタン
            $(document).on('click', '#doCatClose', function() {
                // clickイベントの処理
                $('#catView').hide();
            });
            // 写真削除ボタン
            $(document).on('click', '#doCatDelete', function() {
                // clickイベントの処理
                IndexCtrl.removePhoto();
            });
            // 地図スワイプ
            $("#mymap").swipe( {
                //Generic swipe handler for all directions
                swipe:function(event, direction, distance, duration, fingerCount, fingerData) {
                    $('#doAuto').html('手動');
                    $('#doAuto').removeClass('is-error');
                    IndexCtrl.autoF = false;
                },
                //Default is 75px, set to 0 for demo so any distance triggers swipe
                 threshold:0
            });

            // ビューの非表示
            $('#settingView').hide();
            $('#listView').hide();
            $('#photoView').hide();
            $('#catView').hide();
            $('#aboutView').hide();

            // 設定ボタンの制御
            IndexCtrl.dispShrineIcon(true);
            IndexCtrl.dispTempleIcon(true);
            IndexCtrl.dispParkIcon(true);

            IndexCtrl.mymap = L.map('mymap', {
                center: [35.7102, 139.8132],
                zoom: 13,
                zoomControl: false // default true
            })

            L.tileLayer('https://{s}.tile.thunderforest.com/neighbourhood/{z}/{x}/{y}.png?apikey={apikey}', {
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
                IndexCtrl.dispPhoto(_lat, _lng);
            }

            var z = IndexCtrl.mymap.getZoom();
            if (IndexCtrl.zoom != z) {
                IndexCtrl.dispNostalgy(_lat, _lng);
                IndexCtrl.dispTemple(_lat, _lng);
                IndexCtrl.dispPark(_lat, _lng);
            }

            // ネコが近くにいたらアラートを出す。
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
            _distance = 0,
            _pointLat = 0,
            _pointLng = 0,
            _point = [];

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
            _ran = 0;

        try {
            Util.startWriteLog(IndexCtrl._className, _functionName);
            // 処理開始
            _ran = Math.floor(Math.random() * 2) + 1;

            if (40 <= data.nostalgiaRatio) {
                switch (_ran) {
                    case 1:
                        return IndexCtrl.mapIcon.gold1;
                    case 2:
                        return IndexCtrl.mapIcon.gold2;
                }
            } else if (20 <= data.nostalgiaRatio) {
                switch (_ran) {
                    case 1:
                        return IndexCtrl.mapIcon.silver1;
                    case 2:
                        return IndexCtrl.mapIcon.silver2;
                }
            } else {
                switch (_ran) {
                    case 1:
                        return IndexCtrl.mapIcon.bronze1;
                    case 2:
                        return IndexCtrl.mapIcon.bronze2;
                }
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
                $('#doAuto').html('手動');
                $('#doAuto').removeClass('is-error');
                IndexCtrl.autoF = false;
            } else {
                $('#doAuto').html('自動');
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
                        navigator.vibrate([500]);
                        alert('近くでネコの匂いがしますね。。。');
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
            } else {
                $('#doTwitterLogin').show();
                $('#doTwitterLogout').hide();
            }
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
            _file = document.querySelector('#fileUpload').files[0];
            _reader = new FileReader();

            _reader.addEventListener("load", function() {
                logger.info(_reader.result);

                // Resize Base64 Image
                Util.imgB64Resize(_reader.result, function(imgB64) {
                    // Destination Image
                    var oauthToken = localStorage.getItem("oauth_token");
                    var oauthTokenSecret = localStorage.getItem("oauth_token_secret");
                    $.ajax({
                        url: IndexCtrl.urls.setPhoto, // 通信先のURL
                        type: 'POST', // 使用するHTTPメソッド
                        data: {
                            uuid: null,
                            userId: IndexCtrl.userId,
                            oauthToken: oauthToken,
                            oauthTokenSecret: oauthTokenSecret,
                            lat: IndexCtrl.lat,
                            lng: IndexCtrl.lng,
                            photo: imgB64,
                        }, // 送信するデータ
                    }).done(function(ret, textStatus, jqXHR) {
                        logger.info(ret); //コンソールにJSONが表示される
                    }).fail(function(jqXHR, textStatus, errorThrown) {
                        logger.error(errorThrown);
                    }).always(function() {
                        //     logger.info('***** 処理終了 *****');
                        $('#fileUpload').val('');
                        $('#photoView').hide();
                        IndexCtrl.dispPhoto(IndexCtrl.lat, IndexCtrl.lng);
                        alert('写真を登録しました。');
                    });
                });

            }, false);

            if (_file) {
                _reader.readAsDataURL(_file);
            }
            // 処理終了
        } catch (ex) {
            logger.error(ex);
        } finally {
            Util.endWriteLog(IndexCtrl._className, _functionName);
            $('#photoView').hide();
        }
    },

    dispPhoto: function UN_dispPhoto(lat, lng) {
        var _functionName = 'UN_dispPhoto',
            _distance = 0,
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

            IndexCtrl.photos = [];

            $.ajax({
                url: IndexCtrl.urls.getPhoto, // 通信先のURL
                type: 'GET', // 使用するHTTPメソッド
                data: {
                    userId: null,
                    lat: lat,
                    lng: lng,
                    distance: IndexCtrl.RANGE_DISTANCE / 2
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
                            IndexCtrl.dispCat(null, data);
                        });
                    marker.data = data;
                    IndexCtrl.photos.push(marker);
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

    dispPhotoList: function UN_dispPhotoList() {
        var _functionName = 'UN_dispPhotoList';

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
                    alert('まだ、ネコを撮影していません。');
                    return;
                }

                $('#listView').show();
                var html = '';
                IndexCtrl.photos2 = ret.results;
                for (var i = 0; i < ret.results.length; i++) {
                    var data = ret.results[i];
                    logger.info(data);
                    if (i % 2 == 0) {
                        html += '<tr>';
                        html += '<td align="center" valign="middle" style="width: 120px;">';
                        html += '<a onclick="IndexCtrl.dispCat(\'' + data.uuid +  '\', null)">';
                        html += '<span style="display: block;height: 0;width: 100%;padding-bottom: 100%;'
                        html += 'background: url(\'' + data.url + '\');';
                        html += 'background-size: cover;';
                        html += 'background-position: center;';
                        html += '"></span>'
                        html += '</a>';
                        html += '</td>';
                    } else {
                        html += '<td align="center" valign="middle" style="width: 120px;">';
                        html += '<a onclick="IndexCtrl.dispCat(\'' + data.uuid +  '\', null)">';
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

    dispCat: function UN_dispCat(uuid, data) {
        var _functionName = 'UN_dispCat';

        try {
            Util.startWriteLog(IndexCtrl._className, _functionName);
            // 処理開始
            if (uuid) {
                for( var val in IndexCtrl.photos2) {
                    var photo = IndexCtrl.photos2[val];
                    if (uuid == photo.uuid) {
                        data = photo;
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

            if (data.userId == IndexCtrl.userId) {
                $('#doCatDelete').show();
            } else {
                $('#doCatDelete').hide();
            }

            $('#photoId').val(data.uuid);
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
                    IndexCtrl.dispPhoto(IndexCtrl.lat, IndexCtrl.lng);
                }).fail(function(jqXHR, textStatus, errorThrown) {
                    logger.error(errorThrown);
                }).always(function() {
                    $('#catView').hide();
                    $('#listView').hide();
                    alert('写真を削除しました。');
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
            } else {
                $('#doTwitterLogin').show();
                $('#doTwitterLogout').hide();
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
            $.getJSON('https://rojine.co/cat.json', function(data) {
                for(var val in data) {
                    var cat = data[val]
                    if (id.toUpperCase() == cat.id.toUpperCase() ) {
                         $('#catName').text(cat.name);
                         break;
                    }
                }
            });
            // 処理終了
        } catch (ex) {
            logger.error(ex);
        } finally {
            Util.endWriteLog(IndexCtrl._className, _functionName);
        }
    },

};

$(document).ready(function() {
    IndexCtrl.init();
});