/*
 * タイトル：ログイン画面JS
 * 説明    ：
 * 著作権  ：Copyright(c) 2018 LivLog llc.
 * 会社名  ：リブログ合同会社
 * 変更履歴：2019.01.21
 *         ：新規登録
 */
//34567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890
var LoginCtrl = {
//+----- ↓定数・変数の設定ココから -----------------------------------------------------------------+
    _className: 'LoginCtrl',
//+----- ↓functionの記述ココから -----------------------------------------------------------------+
    login: function UN_login() {
        var _functionName = 'UN_login';

        try {
            Util.startWriteLog(LoginCtrl._className,_functionName);
            // 処理開始
            OAuth.initialize('Q-wGViV-TLkPEozGl_Uro0XEpuw')
            OAuth.setOAuthdURL('https://auth.livlog.xyz')
            OAuth.popup('twitter',function(err, res){ //コールバック関数

                //ローカルストレージに保存する方が好ましいと思われる
                localStorage.setItem("oauth_token", res.oauth_token);
                localStorage.setItem("oauth_token_secret", res.oauth_token_secret);

                _formdata = {
                    'uuid': IndexCtrl.uuid,
                    'twitterToken': res.oauth_token,
                }
                $.ajax({
                    url: 'login',
                    type: 'GET',
                    data: _formdata,
                    dataType: 'json',
                })
                // Ajaxリクエストが成功した時
                .done( (data_) => {
                    console.log(data_);
                    IndexCtrl.uuid = data_.login.uuid;
                    localStorage.setItem(IndexCtrl.SESSION_UUID, IndexCtrl.uuid);
                    // ログイン状態の確認
                    LoginCtrl.changeBtn();
                });

            //以下追加コード
            }).then(function(){ //終了処理

                  //コールバック処理(元のアドレスに戻る)
                  OAuth.callback('twitter',  "callback/url");

            });
            // 処理終了
        }
        catch (ex) {
            logger.error(ex);
        }
        finally {
            Util.endWriteLog(LoginCtrl._className,_functionName);
        }
    },

    logout: function UN_logout() {
        var _functionName = 'UN_logout';

        try {
            Util.startWriteLog(LoginCtrl._className,_functionName);
            // 処理開始
            localStorage.removeItem("oauth_token");
            localStorage.removeItem("oauth_token_secret");
            // ログイン状態の確認
            LoginCtrl.changeBtn();
            // 処理終了
        }
        catch (ex) {
            logger.error(ex);
        }
        finally {
            Util.endWriteLog(LoginCtrl._className,_functionName);
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
                $('#logoutBtn').show();
                $('#loginBtn').hide();
                $('#twitterLabel').show();
                $('#twitterF').prop('checked', true);
            } else {
                $('#loginBtn').show();
                $('#logoutBtn').hide();
                $('#twitterLabel').hide();
                $('#twitterF').prop('checked', false);
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
};
