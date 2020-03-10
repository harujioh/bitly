window.onload = function () {
  $('#accessToken').val(localStorage['accessToken']);

  $('form').submit(function () {
    localStorage['accessToken'] = $('#accessToken').val();

    window.close();
  });
};
