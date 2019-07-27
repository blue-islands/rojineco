/*
 * タイトル：戦闘画面JS
 * 説明    ：
 * 著作権  ：Copyright(c) 2019 rojineco project.
 * 会社名  ：ロジネコプロジェクト
 * 変更履歴：2019.07.27
 *        ：新規登録
 */
//34567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890
var AttackCtrl = {};
//+----- ↓定数・変数の設定ココから -----------------------------------------------------------------+
AttackCtrl = {
    _className: 'AttackCtrl',

//+----- ↓functionの記述ココから -----------------------------------------------------------------+
    attack: function UN_attack(data) {
        var _functionName = 'UN_attack';

        try {
            Util.startWriteLog(AttackCtrl._className,_functionName);
            // 処理開始
            logger.info(data);
            alert('ネコが現れた');
            // 処理終了
        }
        catch (ex) {
            logger.error(ex);
        }
        finally {
            Util.endWriteLog(AttackCtrl._className,_functionName);
        }
    },
};
