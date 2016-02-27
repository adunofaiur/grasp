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

GraspChoreography.upAndStay = function(swooshables){
  for(var i = 0; i < swooshables.length; i++){
    var swoosh = swooshables[i];
    swoosh.addEventListener('animationend', GraspChoreography.removeAnimation)
    swoosh.classList.add('upAndStay')
  }

}

GraspChoreography.removeAnimation = function(event){
  $(event.target).removeClass('upAndStay');
}
