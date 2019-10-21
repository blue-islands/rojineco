/*
 * タイトル：ユーティリティ処理JS
 * 説明    ：
 * 著作権  ：Copyright(c) 2019 rojineco project.
 * 会社名  ：ロジねこプロジェクト
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

            var _array = imgB64Src.split(',');
            var _buffer = base64ToArrayBuffer(_array[1]);

            var _orientation = Util.getOrientation(_buffer);
            logger.info(_orientation);

            // Image Type
            var _imgType = imgB64Src.substring(5, imgB64Src.indexOf(";"));
            // Source Image
            var _img = new Image();
            _img.onload = function() {

                var imageAspect, canvasWidth, canvasHeight, drawWidth, drawHeight;

                //アスペクト取得
                imageAspect = (_orientation == 5 || _orientation == 6 || _orientation == 7 || _orientation == 8) ? _img.width / _img.height : _img.height / _img.width;

                canvasWidth = _img.width;
                canvasHeight = Math.floor(canvasWidth * imageAspect);

                if(canvasWidth > canvasHeight){
                    // 横長の画像は横のサイズを指定値にあわせる
                    var ratio = canvasHeight / canvasWidth;
                    canvasWidth = Util.THUMBNAIL_WIDTH;
                    canvasHeight = Util.THUMBNAIL_WIDTH * ratio;
                } else {
                    // 縦長の画像は縦のサイズを指定値にあわせる
                    var ratio = canvasWidth / canvasHeight;
                    canvasWidth = Util.THUMBNAIL_HEIGHT * ratio;
                    canvasHeight = Util.THUMBNAIL_HEIGHT;
                }

                // New Canvas
                var canvas = document.createElement('canvas');
                canvas.width = canvasWidth;
                canvas.height = canvasHeight;
                // Draw (Resize)
                var ctx = canvas.getContext('2d');

                //描画サイズを指定
                drawWidth = canvasWidth;
                drawHeight = canvasHeight;

                switch(_orientation){

                    case 2:
                        ctx.transform(-1, 0, 0, 1, canvasWidth, 0);
                        break;

                    case 3:
                        ctx.transform(-1, 0, 0, -1, canvasWidth, canvasHeight);
                        break;

                    case 4:
                        ctx.transform(1, 0, 0, -1, 0, canvasHeight);
                        break;

                    case 5:
                        ctx.transform(-1, 0, 0, 1, 0, 0);
                        ctx.rotate((90 * Math.PI) / 180);
                        drawWidth = canvasHeight;
                        drawHeight = canvasWidth;
                        break;

                    case 6:
                        ctx.transform(1, 0, 0, 1, canvasWidth, 0);
                        ctx.rotate((90 * Math.PI) / 180);
                        drawWidth = canvasHeight;
                        drawHeight = canvasWidth;
                        break;

                    case 7:
                        ctx.transform(-1, 0, 0, 1, canvasWidth, canvasHeight);
                        ctx.rotate((-90 * Math.PI) / 180);
                        drawWidth = canvasHeight;
                        drawHeight = canvasWidth;
                        break;

                    case 8:
                        ctx.transform(1, 0, 0, 1, 0, canvasHeight);
                        ctx.rotate((-90 * Math.PI) / 180);
                        drawWidth = canvasHeight;
                        drawHeight = canvasWidth;
                        break;

                    default:
                        break;
                }
            
                ctx.drawImage(_img, 0, 0, drawWidth, drawHeight);
                // canvas.width = drawWidth;
                // canvas.height = drawHeight;
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

    getOrientation: function UN_getOrientation(buffer) {
        var dv = new DataView(buffer)
        var app1MarkerStart = 2
        // もし JFIF で APP0 Marker がある場合は APP1 Marker の取得位置をずらす
        if (dv.getUint16(app1MarkerStart) !== 65505) {
          const length = dv.getUint16(4)
          app1MarkerStart += length + 2
        }
        if (dv.getUint16(app1MarkerStart) !== 65505) {
          return 0
        }
        // エンディアンを取得
        const littleEndian = dv.getUint8(app1MarkerStart + 10) === 73
        // フィールドの数を確認
        const count = dv.getUint16(app1MarkerStart + 18, littleEndian)
        for (let i = 0; i < count; i++) {
          const start = app1MarkerStart + 20 + i * 12
          const tag = dv.getUint16(start, littleEndian)
          // Orientation の Tag は 274
          if (tag === 274) {
            // Orientation は Type が SHORT なので 2byte だけ読む
            return dv.getUint16(start + 8, littleEndian)
          }
        }
        return 0
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

String.prototype.trim = function() {
    return this.replace(/^[\s　]+|[\s　]+$/g, '');
}
String.prototype.ltrim = function() {
    return this.replace(/^[\s　]+/, '');
}
String.prototype.rtrim = function() {
    return this.replace(/[\s　]+$/, '');
}

function base64ToArrayBuffer(base64) {
    var binary_string =  window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array( len );
    for (var i = 0; i < len; i++)        {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}

function parseStrToBoolean(str) {
    // 文字列を判定
    return (str == 'true') ? true : false;
}

function printProperties(obj) {
    var properties = '';
    for (var prop in obj){
        properties += prop + '=' + obj[prop] + '\n';
    }
    logger.log(properties);
}

function getUrlVars() {
    var vars = [], max = 0, hash = "", array = "";
    var url = window.location.search;

        //?を取り除くため、1から始める。複数のクエリ文字列に対応するため、&で区切る
    hash  = url.slice(1).split('&');    
    max = hash.length;
    for (var i = 0; i < max; i++) {
        array = hash[i].split('=');    //keyと値に分割。
        vars.push(array[0]);    //末尾にクエリ文字列のkeyを挿入。
        vars[array[0]] = array[1];    //先ほど確保したkeyに、値を代入。
    }

    return vars;
}
