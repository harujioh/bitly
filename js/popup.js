var closeTime = 750;

function closeExtension(){
  setTimeout(function(){
    window.close();
  }, closeTime);
}

function openOptions(){
  setTimeout(function(){
    chrome.tabs.create({
      "url": chrome.extension.getURL("options.html"),
    });
  }, closeTime);
}

window.onload = function() {
  chrome.tabs.getSelected(window.id, function (tab) {
    var user = localStorage['login'];
    var apiKey = localStorage['apiKey'];
    if(user == '' || apiKey == ''){
      $('p').text('empty preference');
      openOptions();
      return;
    }

    var url = tab.url;
    if(!url.match(/^https?:\/\//)){
      $('p').text('error');
      closeExtension();
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
          $('p').text('error : ' + json.status_code);
          openOptions();
          return;
        }
        $('a').text(json.data.url);
        $('a').attr('title', tab.title);
        $('a').fadeIn();

        var input = document.getElementsByTagName('input');
        if(input.length > 0){
          input[0].value = json.data.url;
          input[0].select();
          document.execCommand('copy');

          $('p').text('done copy!');
          closeExtension();
          return;
        }
      }
    });
  });
};
