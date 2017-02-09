var flashMessage = function(message) {
  $('#flash').html(message);

  $('#flash').delay(500).fadeIn('normal', function() {
    $(this).delay(2500).fadeOut();
  });
};

$(function() {
  /* ==== get users ==== */
  $('#callAPI').on('click', function(evt) {
    $.ajax({
      method: 'GET',
      url: '/api/random',
    }).done(function(resp) {
      flashMessage(JSON.stringify(resp.data, null, 2));
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
    }).done(function(resp) {
      flashMessage(resp.message.affectedRows);
    });
  });


});

