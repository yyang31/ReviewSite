// modal
function modalShow(){
  document.getElementsByClassName("modal")[0].style.display="block";
  setTimeout(function(){
    document.getElementsByClassName("modal")[0].style.opacity="1";
  }, 100);
}

function modalHide(){
  document.getElementsByClassName("modal")[0].style.opacity="0";
  setTimeout(function(){
    document.getElementsByClassName("modal")[0].style.display="none";
  }, 100);
}

document.getElementsByClassName("modalClose")[0].onclick = function(){
  modalHide();
}

function modalError(msg){
  var modalBody = document.getElementsByClassName("modalBody")[0];

  modalShow();
  modalBody.innerHTML = msg;
}
