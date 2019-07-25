var user = 'harujioh';
var apiKey = 'R_18b28ac337ab53f9d135e5975b03a5f5';

window.onload = function() {
  $('#login').val(localStorage['login']);
  $('#apiKey').val(localStorage['apiKey']);

  $('form').submit(function(){
    localStorage['login'] = $('#login').val();
    localStorage['apiKey'] = $('#apiKey').val();

    window.close();
  });
};
