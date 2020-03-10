var closeTimmeout = -1

function closeExtension(closeTime) {
  clearTimeout(closeTimmeout);
  closeTimmeout = setTimeout(function () {
    window.close();
  }, closeTime);
}

function openOptions(closeTime) {
  setTimeout(function () {
    chrome.tabs.create({
      'url': chrome.extension.getURL('options.html'),
    });
  }, closeTime);
}

window.onload = function () {
  chrome.tabs.getSelected(window.id, function (tab) {
    var accessToken = localStorage['accessToken'];

    var $status = $('#status');
    var $qr = $('#qr');

    if (accessToken == '') {
      $status.text('empty preference');
      openOptions(750);
      return;
    }

    var url = tab.url;
    if (!url.match(/^https?:\/\//)) {
      $status.text('error');
      closeExtension(750);
      return;
    }

    $.ajax({
      type: 'POST',
      url: 'https://api-ssl.bitly.com/v4/shorten',
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/json'
      },
      dataType: 'json',
      data: JSON.stringify({
        long_url: url
      }),
      cache: false
    }).done(function(result){
      var input = document.getElementsByTagName('input');
      if (input.length > 0) {
        input[0].value = result.link;
        input[0].select();
        document.execCommand('copy');

        $status.text('done copy!');
        closeExtension(1500);

        $qr.show().append($('<a>').attr('href', '#').text('create QR').hover(function () {
          clearTimeout(closeTimmeout);
        }, function () {
          closeExtension(1500);
        }).click(function () {
          clearTimeout(closeTimmeout);

          $qr.empty().append($('<img>').attr({
            src: 'https://api.qrserver.com/v1/create-qr-code/?data=' + encodeURI(result.link) + '&size=60x60',
            width: 60,
            height: 60,
            alt: 'QR'
          }));
          return false;
        }));

        return;
      }
    }).fail(function(result){
      $status.text('error : ' + result.status);
      openOptions(750);
    });
  });
};
