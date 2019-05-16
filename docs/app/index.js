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
    mymap: null,
//+----- ↓functionの記述ココから -----------------------------------------------------------------+
    init: function UN_init() {
        var _functionName = 'UN_init';

        try {
            Util.startWriteLog(IndexCtrl._className,_functionName);
            // 処理開始
            IndexCtrl.mymap = L.map('mapid').setView([51.505, -0.09], 13);
            L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
                attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
                maxZoom: 18,
                id: 'mapbox.streets',
                accessToken: 'pk.eyJ1IjoiaGFvc2hpbWEiLCJhIjoiY2lsODJuMjNoMDlhbnZ0a3IxaGw0NDhqOSJ9.HrD7j0q54v_vOseYNVLeEg' //ここにaccess tokenを挿入
            }).addTo(IndexCtrl.mymap);
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
        var _functionName = 'UN_success';

        try {
            Util.startWriteLog(IndexCtrl._className,_functionName);
            // 処理開始
            // 緯度
            logger.info('latitude:' + pos.coords.latitude);
            // 経度
            logger.info('longitude:' + pos.coords.longitude);
            // 移動方向
            logger.info('heading:' + pos.coords.heading);
            // 移動速度
            logger.info('speed:' + pos.coords.speed);

            var lat=pos.coords.latitude; //緯度
            var lon=pos.coords.longitude; //経度
            IndexCtrl.mymap.setView([ lat,lon ]); //地図を移動
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
};


    