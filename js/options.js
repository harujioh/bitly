window.onload = function () {
  $('#login').val(localStorage['login']);
  $('#apiKey').val(localStorage['apiKey']);

  $('form').submit(function () {
    localStorage['login'] = $('#login').val();
    localStorage['apiKey'] = $('#apiKey').val();

    window.close();
  });
};
