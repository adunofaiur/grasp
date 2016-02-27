
var bsService = new BSAutoSwitch();
var Grasp = {};
Grasp.facetList = [];
//used to keep track of how many carriers/brands have been selected
Grasp.carriers = [];

Grasp.brandsSelectedCount = 0;

function Facet(facetType, facetValue){
  this.facetType = facetType;
  this.value = facetValue;
}


function onload(){
    //Initialize the intro screen's material
    var appbar = document.getElementById('appbar');
    Material.addMaterial('appbar', appbar, 8);
    var startbutton = document.getElementById('startbutton');
    Material.addMaterial('startbutton', startbutton, 4);

    Grasp.carriers['verizon'] = false;
    Grasp.carriers['att'] = false;


}

function startButtonHandler(event){
  //Change appBar classes to shrink it
  $('#appbar').removeClass('green').removeClass('expanded').addClass('gray');
  $('#main').removeClass('expanded');
  //add progress bar
  //build new elements
  //use choteography to move content up and off screen
  var nodesToRemove = [];
  nodesToRemove.push(document.getElementById('startbutton'));
  nodesToRemove.push(document.getElementById('startText'));
  GraspChoreography.upAndAway(nodesToRemove);
  //use choreography to move new stuff to resting position
  Grasp.prepareFacetScreens();
}

Grasp.toggleCarrier = function(carrierName){
  var numSelected = 0;
  for(i in Grasp.carriers){
    if(i == carrierName){
      Grasp.carriers[i] = !Grasp.carriers[i];
    }
    if(Grasp.carriers[i]){
      numSelected++;
    }
  }

}

Grasp.carrierButtonHandler = function(event){
    var carrierName = event.target.id;

    if($(event.target).hasClass('selected')){
      $(event.target).removeClass('selected');

    }else{
      $(event.target).addClass('selected');
    }

    Grasp.toggleCarrier(carrierName);

}
Grasp.prepareFacetScreens = function(){
    var main = document.getElementById('main');
    //Build empty facet row


    var facetRow = buildDiv('facetRow');
    main.appendChild(facetRow);

    //build container for selectable carriers
    var carrierRow = buildDiv('carrierRow');
    var attFacet = buildDiv('carrier at', 'att')
    var verizonFacet = buildDiv('carrier vz', 'verizon');
    attFacet.addEventListener('click', Grasp.carrierButtonHandler);
    verizonFacet.addEventListener('click', Grasp.carrierButtonHandler);

    carrierRow.appendChild(attFacet);
    carrierRow.appendChild(verizonFacet);
    main.appendChild(carrierRow);

    var carrierText = buildDiv('centeredText', 'carrierText');
    carrierText.innerHTML = "Choose one or two carriers for your new companion"
    main.appendChild(carrierText);

    var facetConfirm = buildDiv('button green unselectable', 'facetButton')
    facetConfirm.innerHTML = "Confirm";
    facetConfirm.addEventListener('click', Grasp.facetButtonHandler);
    main.appendChild(facetConfirm);
    GraspChoreography.upAndStay([carrierRow, carrierText, facetConfirm]);



    //build the two biggest carriers (more in the future)
    //build confirm button
    //choereoghraph this in
}



function buildDiv(className, id){
	var elem = document.createElement('div');
	elem.className = className;
  if(id)
    elem.id = id;
	return elem;
}
function buildSpan(className, id){
	var elem = document.createElement('span');
	elem.className = className;
  if(id)
    elem.id = id;
	return elem;
}
