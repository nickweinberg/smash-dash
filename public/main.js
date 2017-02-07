$(function() {
  /* ==== get users ==== */
  $('#callAPI').on('click', function(evt) {
    console.log('clicked');
    $.ajax({
      method: 'GET',
      url: '/api/random',
    }).done(function(resp) {
      console.log(resp);
    });
  });

  /* ===== create user ====== */
  $('#createUser').on('click', function(evt) {
    var name = $('#nameField').val();
    console.log(name);
    $.ajax({
      method: 'POST',
      contentType: 'application/json',
      url: '/api/user',
      data: JSON.stringify({ name: name }),
      processData: false,
      dataType: 'json',
    }).done(function(msg) {
      console.log(msg);
    });
  });


});

