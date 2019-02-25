window.onload = function(){
  $(".load").each(function() {
    $(this).load($(this).data('target'));
  });
}
