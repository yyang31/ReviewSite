// modal
if(document.body.contains(document.getElementsByClassName("modal")[0])){
  document.getElementsByClassName("modal-close")[0].onclick = function(){
    modalHide();
  }
}
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

function modalMsg(msg){
  var modalBody = document.getElementsByClassName("modal-body")[0];
  document.getElementById("modalBtn").style.display = "none";

  modalShow();
  modalBody.innerHTML = msg;
}

/*
submitFunction: the function to call when the submit button is clicked (REQUIRED)
*/
function modalTextInput(submitFunction){
  var mdoalBtn = document.getElementById("modalBtn");
  var modalBody = document.getElementsByClassName("modal-body")[0];
  modalBody.innerHTML = "";

  // display the required elements
  modalShow();
  mdoalBtn.style.display = "block";

  // moddify the elements
  mdoalBtn.innerText = "Submit";
  var newTextBox = document.createElement("INPUT");
  newTextBox.setAttribute("id", "modalTextInputPopup");
  newTextBox.setAttribute("type", "text");
  newTextBox.setAttribute("placeholder", "Guess Word");
  newTextBox.setAttribute("style", "text-transform: uppercase");
  modalBody.appendChild(newTextBox);
  document.getElementById("modalTextInputPopup").focus();

  document.getElementById("modalBtn").onclick = function(){
    var textboxInput = document.getElementById("modalTextInputPopup").value;
    submitFunction(textboxInput)
  };
}
