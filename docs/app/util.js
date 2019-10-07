/*
 * タイトル：ユーティリティ処理JS
 * 説明    ：
 * 著作権  ：Copyright(c) 2019 rojineco project.
 * 会社名  ：ロジネコプロジェクト
 * 変更履歴：2015.01.27
 *         ：新規登録
 */
//34567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890
var logger = logdown('rojineco')
logger.state.isEnabled = true;
var Util = {
//+----- ↓定数・変数の設定ココから -----------------------------------------------------------------+
    _className: 'Util',
    THUMBNAIL_WIDTH: 1000, // 画像リサイズ後の横の長さの最大値
    THUMBNAIL_HEIGHT: 1000, // 画像リサイズ後の縦の長さの最大値
//+----- ↓functionの記述ココから -----------------------------------------------------------------+
     startWriteLog: function UN_startWriteLog(className,functionName) {
        var _date = new Date(),
            _log = '';
        //2015-03-14 18:06:09,836 [chronos-pool-6-thread-1] INFO  jp.linedesign.noby.api.task.AutomaticTask - jp.ne.docomo.smt.dev.dialogue.data.DialogueResultData@4eb6e36b
        _log += formatDate(_date) + ' ';
        _log += '[' + className + '] ' + functionName + ' - Start';
        logger.info(_log);
    },

    endWriteLog: function UN_endWriteLog(className,functionName) {
        var _date = new Date(),
        _log = '';
        //2015-03-14 18:06:09,836 [chronos-pool-6-thread-1] INFO  jp.linedesign.noby.api.task.AutomaticTask - jp.ne.docomo.smt.dev.dialogue.data.DialogueResultData@4eb6e36b
        _log += formatDate(_date) + ' ';
        _log += '[' + className + '] ' + functionName + ' - End';
        logger.info(_log);
    },

    getColor: function UN_getColor(no) {
        var colors = ['#1abc9c',
                      '#f1c40f',
                      '#2ecc71',
                      '#e67e22',
                      '#3498db',
                      '#e74c3c',
                      '#9b59b6',
                      '#16a085',
                      '#f39c12',
                      '#27ae60',
                      '#d35400',
                      '#2980b9',
                      '#c0392b',
                      '#8e44ad'];
        var i = no % 14;

        return colors[i];
    },

    sleep: function UN_sleep(waitMsec) {
        var startMsec = new Date();

        // 指定ミリ秒間だけループさせる（CPUは常にビジー状態）
        while (new Date() - startMsec < waitMsec);
    },

    uuid: function UN_uuid() {
        var uuid = "", i, random;
        for (i = 0; i < 32; i++) {
            random = Math.random() * 16 | 0;

            if (i == 8 || i == 12 || i == 16 || i == 20) {
                uuid += "-"
            }
            uuid += (i == 12 ? 4 : (i == 16 ? (random & 3 | 8) : random)).toString(16);
        }
        return uuid;
    },

    imgB64Resize: function UN_imgB64Resize(imgB64Src, callback) {
        var _functionName = 'UN_imgB64Resize',
            _imgType = null,
            _img = null;

        try {
            Util.startWriteLog(IndexCtrl._className, _functionName);
            // 処理開始
            // Image Type
            var _imgType = imgB64Src.substring(5, imgB64Src.indexOf(";"));
            // Source Image
            var _img = new Image();
            _img.onload = function() {

                var width, height;
                if(_img.width > _img.height){
                    // 横長の画像は横のサイズを指定値にあわせる
                    var ratio = _img.height / _img.width;
                    width = Util.THUMBNAIL_WIDTH;
                    height = Util.THUMBNAIL_WIDTH * ratio;
                } else {
                    // 縦長の画像は縦のサイズを指定値にあわせる
                    var ratio = _img.width / _img.height;
                    width = Util.THUMBNAIL_HEIGHT * ratio;
                    height = Util.THUMBNAIL_HEIGHT;
                }

                // New Canvas
                var canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                // Draw (Resize)
                var ctx = canvas.getContext('2d');
                ctx.drawImage(_img, 0, 0, width, height);
                // Destination Image
                var imgB64Dst = canvas.toDataURL(_imgType);
                callback(imgB64Dst);
            };
            _img.src = imgB64Src;
            // 処理終了
        } catch (ex) {
            logger.error(ex);
        } finally {
            Util.endWriteLog(Util._className, _functionName);
        }
    },

    doTest: function UN_doTest() {
        alert('ようこそ！');
    },

};

/**
 * タイムスタンプ出力
 * @param date
 * @param format
 * @returns {String}
 */
function formatDate(date, format) {
    if (!format) format = 'YYYY-MM-DD hh:mm:ss.SSS';
    format = format.replace(/YYYY/g, date.getFullYear());
    format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
    format = format.replace(/DD/g, ('0' + date.getDate()).slice(-2));
    format = format.replace(/hh/g, ('0' + date.getHours()).slice(-2));
    format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
    format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
    if (format.match(/S/g)) {
        var milliSeconds = ('00' + date.getMilliseconds()).slice(-3);
        var length = format.match(/S/g).length;
        for (var i = 0; i < length; i++) format = format.replace(/S/, milliSeconds.substring(i, i + 1));
    }
    return format;
}

/**
 * オブジェクトの中身を表示
 * @param obj
 */
function printProperties(obj) {
    var properties = '';
    for (var prop in obj){
        properties += prop + '=' + obj[prop] + '\n';
    }
    logger.log(properties);
}

String.prototype.trim = function() {
    return this.replace(/^[\s　]+|[\s　]+$/g, '');
}
String.prototype.ltrim = function() {
    return this.replace(/^[\s　]+/, '');
}
String.prototype.rtrim = function() {
    return this.replace(/[\s　]+$/, '');
}
