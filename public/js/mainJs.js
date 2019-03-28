var slideTimer = setInterval(featureSlide, 2000);

/**
 * featureSlide - animation that switches the feature banner
 */
function featureSlide() {
  var featureCont = document.getElementsByClassName("feature-cont");

  for(var i = 0; i < featureCont.length; i++){
    if(featureCont[i].classList.contains("active")){
      featureCont[i].classList.remove("active");

      if((i+1) == featureCont.length){
        featureCont[0].classList.add("active");
      }else{
        featureCont[i+1].classList.add("active");
        break;
      }
    }
  }
}
