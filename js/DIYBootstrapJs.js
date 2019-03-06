/**
 * if modal element exist in the current page, add the click trigger for the
 * close button
 */
if(document.body.contains(document.getElementsByClassName("modal")[0])){
  document.getElementsByClassName("modal-close")[0].onclick = function(){
    modalHide();
  }
}

/**
 * modalShow - show the modal
 */
function modalShow(){
  document.getElementsByClassName("modal")[0].style.display="block";
  setTimeout(function(){
    document.getElementsByClassName("modal")[0].style.opacity="1";
  }, 100);
}

/**
 * modalHide - hides the modal
 */
function modalHide(){
  document.getElementsByClassName("modal")[0].style.opacity="0";
  setTimeout(function(){
    document.getElementsByClassName("modal")[0].style.display="none";
  }, 100);
}

/**
 * modalMsg - open the modal and display a message
 *
 * @param  {String} msg the message to be displayed
 */
function modalMsg(msg){
  var modalBody = document.getElementsByClassName("modal-body")[0];
  document.getElementById("modalBtn").style.display = "none";

  modalShow();
  modalBody.innerHTML = msg;
}

/**
 * modalTextInput - open the modal and request a text input form user
 *
 * @param  {String} submitFunction the function to call when the submit button
 *                                 is clicked (REQUIRED)
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
