/*
  Static class that holds methods for animating Grasp HTML - with some of that reuable goodness
*/

var GraspChoreography = {};


//'Swooshes' elements upwards and deletes them after the animation completes
//'swooshables' are a list of DOM nodes
GraspChoreography.upAndAway = function(swooshables){
    for(var i = 0; i < swooshables.length; i++){
      var swoosh = swooshables[i];
      swoosh.addEventListener('animationend', GraspChoreography.removeFromDisplay)
      swoosh.classList.add('upAndAway')
    }
}

GraspChoreography.removeFromDisplay = function(event){
  $(event.target).css('display', 'none');
  $(event.target).removeClass('upAndAway');
}
//Animates an item moving into place
GraspChoreography.upAndStay = function(swooshables, option){
  for(var i = 0; i < swooshables.length; i++){
    var swoosh = swooshables[i];
    swoosh.addEventListener('animationend', GraspChoreography.removeAnimation)
    if(option && option == "lower"){
      swoosh.classList.add('upAndStayLower')

    }else if(option && option == "higher"){
      swoosh.classList.add('upAndStayHigher')

    }
    else{
      swoosh.classList.add('upAndStay')

    }
  }

}

GraspChoreography.removeAnimation = function(event){
  $(event.target).removeClass('upAndStay');
  $(event.target).removeClass('upAndStayLower');
  $(event.target).removeClass('upAndStayHigher');
  $(event.target).removeClass('nope');
  event.target.removeEventListener('animationend', GraspChoreography.removeAnimation);
  event.stopPropagation();

}
