
var bsService = new BSAutoSwitch();
var Grasp = {};
Grasp.facetList = [];
//used to keep track of how many carriers/brands have been selected
Grasp.carriers = [{name: "verizon", active: false},{name: "att", active: false}];
Grasp.brands = [{name: "apple", active: false},{name: "samsung", active: false},
              {name: "nexus", active: false}];

Grasp.activeCarrierCount = 0;
Grasp.activeBrandsCount = 0;
Grasp.stickerPrice = 499.99;
Grasp.monthlyPrice = 20.83;

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
  for(var i = 0; i < Grasp.carriers.length; i++){
    if(carrierName == Grasp.carriers[i].name){

      if(Grasp.carriers[i].active){
        Grasp.activeCarrierCount = Grasp.activeCarrierCount - 1;
      }else{
        Grasp.activeCarrierCount = Grasp.activeCarrierCount + 1;
      }

      Grasp.carriers[i].active = !Grasp.carriers[i].active;
    }

  }

}

Grasp.toggleBrand = function(brandName){
  for(var i = 0; i < Grasp.brands.length; i++){
    if(brandName == Grasp.brands[i].name){

      if(Grasp.brands[i].active){
        Grasp.activeBrandsCount = Grasp.activeBrandsCount - 1;
      }else{
        Grasp.activeBrandsCount = Grasp.activeBrandsCount + 1;

      }

      Grasp.brands[i].active = !Grasp.brands[i].active;
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

    if(Grasp.activeCarrierCount > 0){
      $('#facetButton').removeClass('unselectable');
    }else{
      $('#facetButton').addClass('unselectable');

    }

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
    Material.addMaterial('carrierButton', facetConfirm, 4);

    main.appendChild(facetConfirm);
    GraspChoreography.upAndStay([carrierRow, carrierText, facetConfirm]);



    //build the two biggest carriers (more in the future)
    //build confirm button
    //choereoghraph this in
}

Grasp.buildFacet = function(facet){
    var facetRow = $('.facetRow')[0];

    var facetNode = buildDiv('facetRowItem');

    if(facet.facetType == 'carriers' || facet.facetType == 'brands'){

      if(facet.value.length == 2){

        var backgroundLeft = buildDiv((facet.value[0] + " backgroundLeft"));
        var backgroundRight = buildDiv((facet.value[1] + " backgroundRight"));
        facetNode.appendChild(backgroundLeft);
        facetNode.appendChild(backgroundRight);

      }else{

        var singleImageDisplay = buildDiv('facetSingleBackground ' +  facet.value[0]);
        facetNode.appendChild(singleImageDisplay);

      }

    }

    facetRow.appendChild(facetNode);
    Material.addMaterial(facet.facetType, facetNode, 2);
    return facetNode;
}


Grasp.facetButtonHandler = function(){
  if(Grasp.activeCarrierCount < 1){
    return;
  }
  var main = document.getElementById('main');

  var facetButton = $('#facetButton')[0];
  var carrierRow = $('.carrierRow')[0];
  var textRow = $('#carrierText')[0];
  GraspChoreography.upAndAway([facetButton, carrierRow, textRow]);


  var newCarrierRow = buildDiv('carrierRow', 'brandRow');
  var appleFacet = buildDiv('carrier apple', 'apple')
  var samsungFacet = buildDiv('carrier samsung', 'samsung');
  var nexusFacet = buildDiv('carrier nexus', 'nexus');

  appleFacet.addEventListener('click', Grasp.brandButtonHandler);
  samsungFacet.addEventListener('click', Grasp.brandButtonHandler);
  nexusFacet.addEventListener('click', Grasp.brandButtonHandler);

  newCarrierRow.appendChild(appleFacet);
  newCarrierRow.appendChild(samsungFacet);
  newCarrierRow.appendChild(nexusFacet);
  main.appendChild(newCarrierRow);

  var facetNames = [];
  for(var i = 0; i < Grasp.carriers.length; i++){
    if(Grasp.carriers[i].active){
      facetNames.push(Grasp.carriers[i].name);
    }
  }

  var carrierFacet = new Facet('carriers', facetNames);
  Grasp.facetList.push(carrierFacet);
  var facetRowItem = Grasp.buildFacet(carrierFacet);

  var brandText = buildDiv('centeredText', 'brandText');
  brandText.innerHTML = "Choose one or two brands you'd like to browse"
  main.appendChild(brandText);


  var brandConfirm = buildDiv('button green unselectable', 'brandButton')
  brandConfirm.innerHTML = "Confirm";
  brandConfirm.addEventListener('click', Grasp.brandConfirmButtonHandler);
  Material.addMaterial('brandConfirm', brandConfirm, 4);

  main.appendChild(brandConfirm);

  GraspChoreography.upAndStay([facetRowItem], 'higher');
  GraspChoreography.upAndStay([brandConfirm, newCarrierRow, brandText], 'lower');
  //I should double check to see if anything's selected.
  //Build the brand stuff
  //build facet controls in top bar
  //Swoop current stuff off
  //swoop in
}


Grasp.brandConfirmButtonHandler = function(){
  if(Grasp.activeBrandsCount < 1){
    return;
  }
  var main = document.getElementById('main');

  //get rid of shiz
  var brandButton = $('#brandButton')[0];
  var carrierRow = $('#brandRow')[0];
  var textRow = $('#brandText')[0];
  GraspChoreography.upAndAway([brandButton, carrierRow, textRow]);

  var facetNames = [];
  for(var i = 0; i < Grasp.brands.length; i++){
    if(Grasp.brands[i].active){
      facetNames.push(Grasp.brands[i].name);
    }
  }

  var brandsFacet = new Facet('brands', facetNames);
  Grasp.facetList.push(brandsFacet);
  var facetRowItem = Grasp.buildFacet(brandsFacet);


  //Build the pricing HTML
  var priceRow = buildDiv('priceRow');

  var priceLabels = buildDiv('priceLabels');
  var stickerPriceLabel = buildDiv('priceLabel');
  var chumpPriceLabel = buildDiv('priceLabel');
  stickerPriceLabel.innerHTML = "Sticker Price";
  chumpPriceLabel.innerHTML = "Monthly Price <span class='chump'>per 24 months</span>";
  priceLabels.appendChild(stickerPriceLabel);
  priceLabels.appendChild(chumpPriceLabel);

  var priceValues = buildDiv('priceValues');
  var priceInput = document.createElement('input');
  priceInput.type = "number";
  priceInput.id = "stickerInput";
  priceInput.min = "49.99";
  priceInput.max = "999.99";
  priceInput.step =" 0.01"
  priceInput.value = "499.99"
  priceInput.className = "priceInput"
  var monthlyInput = document.createElement('input');
  monthlyInput.type = "number";
  monthlyInput.id = "monthlyInput";
  monthlyInput.value = "20.83"
  monthlyInput.className = "priceInput"
  monthlyInput.min = "2.00";
  monthlyInput.max = "42.00";
  monthlyInput.step= "0.01";


  priceValues.appendChild(priceInput);
  priceValues.appendChild(monthlyInput);

  priceRow.appendChild(priceLabels);
  priceRow.appendChild(priceValues);
  main.appendChild(priceRow);
  var priceText = buildDiv('centeredText priceText', 'priceText');
  priceText.innerHTML = "Select a max price. Expect recent phones to cost around $650, older models $550, and budget options $250"
  main.appendChild(priceText);

  var priceConfirm = buildDiv('button green ', 'priceButton')
  priceConfirm.innerHTML = "Confirm";
  priceConfirm.addEventListener('click', Grasp.priceConfirmButtonHandler);
  Material.addMaterial('priceConfirm', priceConfirm, 4);

  main.appendChild(priceConfirm);

  GraspChoreography.upAndStay([facetRowItem], 'higher');
  GraspChoreography.upAndStay([priceConfirm, priceRow, priceText], 'lower');
  $('#stickerInput').on('input', function() {
      Grasp.stickerPrice = parseFloat($(this).val())
      Grasp.stickerPrice = Grasp.stickerPrice.toFixed(2)

   // get the current value of the input field.
      $(this).val(Grasp.stickerPrice)
      Grasp.monthlyPrice = (Grasp.stickerPrice/24).toFixed(2); // convert to monthly with 2 decimal places

      //updateOtherFieldWithValue
      $('#monthlyInput').val(Grasp.monthlyPrice)
  });
  $('#monthlyInput').on('input', function() {
    Grasp.monthlyPrice =  parseFloat($(this).val());
    Grasp.monthyPrice = Grasp.monthlyPrice.toFixed(2);
    $(this).val(Grasp.monthlyPrice)
    Grasp.stickerPrice = (Grasp.monthlyPrice*24).toFixed(2);// convert to sticker price

    //updateOtherFieldWithValue
    $('#stickerInput').val(Grasp.stickerPrice)  });


}

Grasp.brandButtonHandler = function(event){
    var brandName = event.target.id;
    var selected = $(event.target).hasClass('selected');
    if(Grasp.activeBrandsCount < 2 || selected){
      if($(event.target).hasClass('selected')){
        $(event.target).removeClass('selected');

      }else{
        $(event.target).addClass('selected');
      }

      Grasp.toggleBrand(brandName);

      if(Grasp.activeBrandsCount > 0){
        $('#brandButton').removeClass('unselectable');
      }else{
        $('#brandButton').addClass('unselectable');

      }
      //mark all brands with the unselectable css and,
      //else make sure none are unselectable
      if(Grasp.activeBrandsCount >= 2){
        $('.carrier').addClass('unselectable');
      }else {
        $('.carrier').removeClass('unselectable');

      }

    }else{
      $(event.target).addClass('nope');
      event.target.addEventListener('animationend', GraspChoreography.removeAnimation);
    }


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
