/*
 * タイトル：ログイン画面JS
 * 説明    ：
 * 著作権  ：Copyright(c) 2019 rojineco project.
 * 会社名  ：ロジねこプロジェクト
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
            const austin = new Austin("https://livlog.xyz", "kqNxNdN4F9aZ");
            austin.popup("twitter", function(data) {
                if (data.status == 'ok') {
                    //ローカルストレージに保存する方が好ましいと思われる
                    localStorage.setItem("oauth_token", data.oauthToken);
                    localStorage.setItem("oauth_token_secret", data.oauthTokenSecret);
                    localStorage.setItem("check_twitter", true);

                    _formdata = {
                        'uuid': IndexCtrl.userId,
                        'twitterToken': data.oauthToken,
                    }
                    $.ajax({
                        url: IndexCtrl.urls.login,
                        type: 'GET',
                        data: _formdata,
                        dataType: 'json',
                    })
                    // Ajaxリクエストが成功した時
                    .done( (data) => {
                        if (data.results.length > 0) {
                            var  result = data.results[0];
                            IndexCtrl.userId = result.uuid;
                            localStorage.setItem(IndexCtrl.SESSION_UUID, IndexCtrl.userId);
                            // ログイン状態の確認
                            IndexCtrl.changeBtn();
                        }
                    });
                }
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
            localStorage.removeItem("check_twitter");
            // ログイン状態の確認
            IndexCtrl.changeBtn();
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
