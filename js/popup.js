var closeTimmeout = -1

function closeExtension(closeTime){
  clearTimeout(closeTimmeout);
  closeTimmeout = setTimeout(function(){
    window.close();
  }, closeTime);
}

function openOptions(closeTime){
  setTimeout(function(){
    chrome.tabs.create({
      'url': chrome.extension.getURL('options.html'),
    });
  }, closeTime);
}

window.onload = function() {
  chrome.tabs.getSelected(window.id, function (tab) {
    var user = localStorage['login'];
    var apiKey = localStorage['apiKey'];
    
    var $status = $('#status');
    var $qr = $('#qr');
    
    if(user == '' || apiKey == ''){
      $status.text('empty preference');
      openOptions(750);
      return;
    }

    var url = tab.url;
    if(!url.match(/^https?:\/\//)){
      $status.text('error');
      closeExtension(750);
      return;
    }

    $.ajax({
      type: 'get',
      dataType: 'json',
      url: 'http://api.bitly.com/v3/shorten'
             + '?login=' + user
             + '&apiKey=' + apiKey
             + '&format=json'
             + '&longUrl=' + encodeURIComponent(url),
      success: function(json){
        if(json.status_code != 200){
          $status.text('error : ' + json.status_code);
          openOptions(750);
          return;
        }

        var input = document.getElementsByTagName('input');
        if(input.length > 0){
          input[0].value = json.data.url;
          input[0].select();
          document.execCommand('copy');

          $status.text('done copy!');
          closeExtension(1500);

          $qr.show().append($('<a>').attr('href', '#').text('create QR').hover(function(){
            clearTimeout(closeTimmeout);
          }, function(){
            closeExtension(1500);
          }).click(function(){
            clearTimeout(closeTimmeout);

            $qr.empty().append($('<img>').attr({
              src : 'https://api.qrserver.com/v1/create-qr-code/?data=' + encodeURI(json.data.url) + '&size=60x60',
              width : 60,
              height : 60,
              alt : 'QR'
            }));
            return false;
          }));

          return;
        }
      }
    });
  });
};
