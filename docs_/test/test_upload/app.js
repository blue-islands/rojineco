//アップロード
function upload() {
    console.info('アップロードするよ！');

    var file    = document.querySelector('#testUpload').files[0];
    var reader  = new FileReader();
  
    reader.addEventListener("load", function () {
    //   preview.src = reader.result;
      　console.log(reader.result); 

        $.ajax({	
            url: 'http://localhost:8080/setPhoto', // 通信先のURL
            type:'POST',		// 使用するHTTPメソッド
            data:{
                uuid: null,
                userId: 'test',
                lat: 0,
                lng: 0,
                photo: reader.result,
            }, // 送信するデータ
        }).done(function(ret, textStatus, jqXHR) {
            console.log(ret); //コンソールにJSONが表示される
    
        }).fail(function(jqXHR, textStatus, errorThrown ) {
            console.log(errorThrown);
        // }).always(function(){
        //     logger.info('***** 処理終了 *****');
        });
    }, false);

    if (file) {
        reader.readAsDataURL(file);
    }　
}