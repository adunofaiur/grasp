
var bsService = new BSAutoSwitch();
var Grasp = {};
Grasp.facetList = [];
//used to keep track of how many carriers/brands have been selected
Grasp.carriers = [{name: "verizon", active: false},{name: "att", active: false}];
Grasp.brands = [{name: "apple", active: false},{name: "htc", active: false},
              {name: "nexus", active: false}];

Grasp.activeCarrierCount = 0;
Grasp.activeBrandsCount = 0;
Grasp.pinnedPhones = 0;
Grasp.stickerPrice = 499.99;
Grasp.monthlyPrice = 20.83;
Grasp.phones = [];
Grasp.phoneMap = new Map();
Grasp.selectScreen = false;
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
    //found in phones.js
    window.setTimeout(preparePhones, 10);


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
    var optionRow = buildDiv('optionRow', 'carrierYas');
    var attFacet = buildDiv('carrier at', 'att')
    var verizonFacet = buildDiv('carrier vz', 'verizon');
    attFacet.addEventListener('click', Grasp.carrierButtonHandler);
    verizonFacet.addEventListener('click', Grasp.carrierButtonHandler);

    optionRow.appendChild(attFacet);
    optionRow.appendChild(verizonFacet);
    main.appendChild(optionRow);

    var carrierText = buildDiv('centeredText', 'carrierText');
    carrierText.innerHTML = "Choose one or two carriers for your new companion"
    main.appendChild(carrierText);

    var facetConfirm = buildDiv('button green unselectable', 'facetButton')
    facetConfirm.innerHTML = "Confirm";
    facetConfirm.addEventListener('click', Grasp.facetButtonHandler);
    Material.addMaterial('carrierButton', facetConfirm, 4);

    main.appendChild(facetConfirm);
    GraspChoreography.upAndStay([optionRow, carrierText, facetConfirm]);



    //build the two biggest carriers (more in the future)
    //build confirm button
    //choereoghraph this in
}


Grasp.buildFacetInnards = function(parent, facet){
  if(facet.facetType == 'carriers' || facet.facetType == 'brands'){

    if(facet.value.length == 2){

      var backgroundLeft = buildDiv((facet.value[0] + " backgroundLeft"));
      var backgroundRight = buildDiv((facet.value[1] + " backgroundRight"));
      parent.appendChild(backgroundLeft);
      parent.appendChild(backgroundRight);

    }else{

      var singleImageDisplay = buildDiv('facetSingleBackground ' +  facet.value[0]);
      parent.appendChild(singleImageDisplay);

    }

  }else if (facet.facetType == "price"){
    var priceDisplay = buildDiv('priceFacetLabel');
    priceDisplay.innerHTML = "$" + facet.value[0].toString();
    parent.appendChild(priceDisplay);
  }

}

Grasp.buildFacet = function(facet){
    var facetRow = $('.facetRow')[0];

    var facetNode = buildDiv('facetRowItem', facet.facetType);
    Grasp.buildFacetInnards(facetNode, facet);
    facetNode.addEventListener('click', Grasp.facetPopOver);

    facetRow.appendChild(facetNode);
    Material.addMaterial(facet.facetType, facetNode, 2);
    facetNode.style.zIndex = "";
    return facetNode;
}

function popoverCancel(event){
  var possibleParent = $(event.target).closest('.facetPopOver');
  if(possibleParent.length > 0){
    event.stopPropagation();
    return;
  }else{
    var listener = $('.facetRowItem');
    for(var i = 0; i < listener.length; i++){
      listener[i].addEventListener('click', Grasp.facetPopOver)
    }
    $('.facetPopOver').css('display', 'none');
    document.body.removeEventListener('click', popoverCancel);
  }
}

Grasp.facetPopOver = function(event){

  if($(event.target).find('.facetPopOver').length > 0){
    $(event.target).find('.facetPopOver').css('display', 'flex');
    var facetNode = $(event.target).closest('.facetRowItem')[0];
    facetNode.removeEventListener('click', Grasp.facetPopOver);
    event.stopPropagation();
    document.body.addEventListener('click', popoverCancel);
    if(Grasp.selectScreen){
      $(facetNode).closest('popConfirm').removeClass('unselectable');
    }

    return;
  }
  var facetNode = $(event.target).closest('.facetRowItem')[0];
  facetNode.removeEventListener('click', Grasp.facetPopOver);
  var type = facetNode.id;
  var popOver = buildDiv('facetPopOver material');
  var row;

  if(type == "carriers"){
    row = document.getElementById('carrierYas');
    popOver.style.height = "320px"
  }else if (type == "brands"){
    row = document.getElementById('brandRow');
    popOver.style.height = "400px"

  }
  if (type != "price"){

    $(row).find('.carrier').addClass('popped');
    $(row).addClass('popped').css('display', 'flex');
    $(row).detach().appendTo(popOver);
 }else{
   row = document.getElementById('priceRow');

   $(row).find('.priceLabels').remove();
   $(row).find('#monthlyInput').remove();
   $(row).find('#stickerInput').addClass('popped');
   $(row).find('.priceValues').addClass('popped');
   popOver.style.height = "220px"
   $(row).addClass('popped').css('display', 'flex');
   $(row).detach().appendTo(popOver);

 }
  var popConfirm = buildDiv('popConfirm button green');
  if(!Grasp.selectScreen){
    $(popConfirm).addClass('unselectable');
  }
  popConfirm.innerHTML = 'Apply';
  popConfirm.addEventListener('click', Grasp.handlePopConfirm);
  event.stopPropagation();
  document.body.addEventListener('click', popoverCancel);
  Material.addMaterial(type + 'pop', popOver, 6);
  popOver.appendChild(popConfirm)
  facetNode.appendChild(popOver);
}

Grasp.handlePopConfirm = function(event){
  if(Grasp.selectScreen){
    var main = document.getElementById('main');
    Grasp.filteredPhones = Grasp.facetFilter(Grasp.phones);
    var phoneContainer = document.getElementById('phoneGrid');
    var existingHTML = $('.phoneContainer');
    //got hrough phone HTML. if phone already exists and is in, do nothing
    //if phone exists and isn't in, remove if not pinned.
    for(var i = 0; i < existingHTML.length; i++){

      var html = existingHTML[i];
      var existingPhone = Grasp.phoneMap.get(html.id);
      var keepPhone = false;
      if(existingPhone.pinned){
        keepPhone = true;
      }
      if(!existingPhone.removed){
        for(var j = 0; j < Grasp.filteredPhones.length; j++){
          var phone = Grasp.filteredPhones[j];
          if(phone.name == existingPhone.name){
            keepPhone = true;
            phone.build = false;
          }
        }
      }
      if(!keepPhone){
        $(html).remove();
      }

    }

  //Build their HTML and append, append, append!
  for(var i = 0; i < Grasp.filteredPhones.length; i++){
    var phone = Grasp.filteredPhones[i];
    if(phone.build != false && !phone.removed){
      Grasp.filteredPhones[i].buildDisplay(phoneContainer)
    //  GraspChoreography.upAndStay([Grasp.filteredPhones[i].container]);
    }

  }

  for(var i = 0; i < Grasp.phones.length; i++){
    Grasp.phones[i].build = true;
  }
  Grasp.sortPhoneGrid();

    var listener = $('.facetRowItem');
    for(var i = 0; i < listener.length; i++){
      listener[i].addEventListener('click', Grasp.facetPopOver)
    }
    $('.facetPopOver').css('display', 'none');


    //update the display of our facet nodes
    var facetNode = $(event.target).closest('.facetRowItem');
    $(facetNode).find('.priceFacetLabel').remove();
    $(facetNode).find('.backgroundLeft').remove();
    $(facetNode).find('.backgroundRight').remove();


    var facet;
    var facetNames = [];
    if(facetNode[0].id == 'carriers'){

      for(var i = 0; i < Grasp.carriers.length; i++){
        if(Grasp.carriers[i].active){
          facetNames.push(Grasp.carriers[i].name);
        }
      }
      facet = new Facet(facetNode[0].id, facetNames)
    }else if(facetNode[0].id == 'brands'){
      for(var i = 0; i < Grasp.brands.length; i++){
        if(Grasp.brands[i].active){
          facetNames.push(Grasp.brands[i].name);
        }
      }
       facet = new Facet(facetNode[0].id, facetNames)
    }else{
      facet = new Facet(facetNode[0].id, [Grasp.stickerPrice]);
    }


    Grasp.buildFacetInnards(facetNode[0], facet);
    document.body.removeEventListener('click', popoverCancel);
    event.stopPropagation();


  }
}
Grasp.facetButtonHandler = function(){
  if(Grasp.activeCarrierCount < 1){
    return;
  }
  var main = document.getElementById('main');

  var facetButton = $('#facetButton')[0];
  var optionRow = $('.optionRow')[0];
  var textRow = $('#carrierText')[0];
  GraspChoreography.upAndAway([facetButton, optionRow, textRow]);


  var newoptionRow = buildDiv('optionRow', 'brandRow');
  var appleFacet = buildDiv('carrier apple', 'apple')
  var htcFacet = buildDiv('carrier htc', 'htc');
  var nexusFacet = buildDiv('carrier nexus', 'nexus');

  appleFacet.addEventListener('click', Grasp.brandButtonHandler);
  htcFacet.addEventListener('click', Grasp.brandButtonHandler);
  nexusFacet.addEventListener('click', Grasp.brandButtonHandler);

  newoptionRow.appendChild(appleFacet);
  newoptionRow.appendChild(htcFacet);
  newoptionRow.appendChild(nexusFacet);
  main.appendChild(newoptionRow);

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
  GraspChoreography.upAndStay([brandConfirm, newoptionRow, brandText], 'lower');
  //I should double check to see if anything's selected.
  //Build the brand stuff
  //build facet controls in top bar
  //Swoop current stuff off
  //swoop in
}

Grasp.sortPhoneGrid = function(mode){
  if(!mode){
    mode = "width"
  }
  var phoneHTMLs = $(".phoneContainer");
  var phonesToSort = [];
  for(var i = 0; i < phoneHTMLs.length; i++){
    var phoneHTML = phoneHTMLs[i];
    $(phoneHTML).detach();
    var phone = Grasp.phoneMap.get(phoneHTML.id);
    phonesToSort.push(phone);
  }
  if(mode == 'width'){
    phonesToSort.sort(function(a,b){
      return a.widthmm - b.widthmm;
    });
  }else{
    phonesToSort.sort(function(a,b){
      return a.heightmm - b.heightmm;
    });

  }

  for(var i = 0; i < phonesToSort.length; i++){
    $(phonesToSort[i].container).appendTo('#phoneGrid');
  }
}
Grasp.brandConfirmButtonHandler = function(){
  if(Grasp.activeBrandsCount < 1){
    return;
  }
  var main = document.getElementById('main');

  //get rid of shiz
  var brandButton = $('#brandButton')[0];
  var optionRow = $('#brandRow')[0];
  var textRow = $('#brandText')[0];
  GraspChoreography.upAndAway([brandButton, optionRow, textRow]);

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
  var priceRow = buildDiv('priceRow', 'priceRow');

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
/*  priceInput.min = "49.99";
  priceInput.max = "999.99";*/
  priceInput.step =" 0.01"
  priceInput.value = "499.99"
  priceInput.className = "priceInput"
  var monthlyInput = document.createElement('input');
  monthlyInput.type = "number";
  monthlyInput.id = "monthlyInput";
  monthlyInput.value = "20.83"
  monthlyInput.className = "priceInput"
/*  monthlyInput.min = "2.00";
  monthlyInput.max = "42.00";*/
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
  $('#stickerInput').on('keypress', function(e) {
      if(e.which == 13){
        Grasp.stickerPrice = parseFloat($(this).val())
        Grasp.stickerPrice = Grasp.stickerPrice.toFixed(2)

     // get the current value of the input field.
        $(this).val(Grasp.stickerPrice)
        Grasp.monthlyPrice = (Grasp.stickerPrice/24).toFixed(2); // convert to monthly with 2 decimal places

        //updateOtherFieldWithValue
        $('#monthlyInput').val(Grasp.monthlyPrice)
      }

  });
  $('#monthlyInput').on('keypress', function(e) {
    if(e.which == 13){

      Grasp.monthlyPrice =  parseFloat($(this).val());
      Grasp.monthyPrice = Grasp.monthlyPrice.toFixed(2);
      $(this).val(Grasp.monthlyPrice)
      Grasp.stickerPrice = (Grasp.monthlyPrice*24).toFixed(2);// convert to sticker price

      //updateOtherFieldWithValue
      $('#stickerInput').val(Grasp.stickerPrice)
    }
      });


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
      event.stopPropagation();
    }



}
//The Big-o notation on this is horrible, but that's why I'm in HCI not algorithm design
Grasp.facetFilter = function(phoneList){
  var thoseWhoRemain = []
  for(var i = 0; i < phoneList.length; i++){
    var phone = phoneList[i];
    var carrierSurivor = false;
    //first I filter in based on carrier and then start striking them out
    for(var j = 0; j < Grasp.carriers.length; j++){
      if(Grasp.carriers[j].active){
        for(var k = 0; k < phone.carriers.length; k++){
          if(phone.carriers[k] == Grasp.carriers[j].name){
            carrierSurivor = true;

          }
        }
      }
    }
    if(carrierSurivor){
      thoseWhoRemain.push(phone);
    }
  }
  var theRealWinners = [];
  for(var i = 0; i < thoseWhoRemain.length; i++){
    var phone = thoseWhoRemain[i];
    var priceSurvivor = false;
    var brandSurvivor = false;
    //sometimes Grasp.sticker prices gets to a string form
    if(typeof Grasp.stickerPrice == 'string'){
      Grasp.stickerPrice = parseFloat(Grasp.stickerPrice);
    }
    if(phone.price  <= Grasp.stickerPrice + 0.01){
      priceSurvivor = true;
    }
    for(var j = 0; j < Grasp.brands.length; j++){
      if(Grasp.brands[j].active && Grasp.brands[j].name == phone.brand){
        brandSurvivor = true;
      }
    }
    if(priceSurvivor && brandSurvivor){
      theRealWinners.push(phone);
    }
  }

  return theRealWinners;
}

Grasp.byWidth = function(){
  if(!$('#byWidth').hasClass('selected')){
    $('#byWidth').addClass('selected')
    $('#byHeight').removeClass('selected')
    Grasp.sortPhoneGrid();
  }
}
Grasp.byHeight = function(){
  if(!$('#byHeight').hasClass('selected')){
    $('#byHeight').addClass('selected')
    $('#byWidth').removeClass('selected')
    Grasp.sortPhoneGrid('height');

  }
}

Grasp.priceConfirmButtonHandler = function(){
  var main = document.getElementById('main');

  Grasp.stickerPrice = parseFloat($('#stickerInput').val())
  Grasp.stickerPrice = Grasp.stickerPrice.toFixed(2)

  //get rid of shiz
  var priceButton = $('#priceButton')[0];
  var priceRow = $('#priceRow')[0];
  var textRow = $('#priceText')[0];
  GraspChoreography.upAndAway([priceButton, priceRow, textRow]);

  var priceFacet = new Facet('price', [Grasp.stickerPrice]);
  Grasp.facetList.push(priceFacet);
  var facetRowItem = Grasp.buildFacet(priceFacet);
  GraspChoreography.upAndStay([facetRowItem], 'higher');


  //Decide which phones you can show
  Grasp.filteredPhones = Grasp.facetFilter(Grasp.phones);
  var phoneContainer = buildDiv('phoneGrid', 'phoneGrid');
  //Build their HTML and append, append, append!
  for(var i = 0; i < Grasp.filteredPhones.length; i++){
    Grasp.filteredPhones[i].buildDisplay(phoneContainer)
  }
  Grasp.selectScreen = true;


  var sortOptions = buildDiv('sortOptions');
  var byWidth = buildDiv('sortOption selected', 'byWidth');
  var byHeight = buildDiv('sortOption', 'byHeight');
  byWidth.innerHTML = "narrowest to widest";
  byHeight.innerHTML = "shortest to tallest";
  byWidth.addEventListener('click', Grasp.byWidth);
  byHeight.addEventListener('click', Grasp.byHeight);

  sortOptions.appendChild(byWidth);
  sortOptions.appendChild(byHeight);
  main.appendChild(sortOptions);
  main.appendChild(phoneContainer);

  Grasp.sortPhoneGrid();

  var helpText = buildDiv('centeredText', 'helpText');
  helpText.innerHTML = "Bookmark up to two phones<br><p>" +
    "Click the media icon to see the phone on Wikipedia, or click on the comment button" +
    " to write out what you're feeling.<br><p> If you need to change your carrier, brand, or price, just click on them!"
  main.appendChild(helpText);

  var phoneConfirm = buildDiv('button green unselectable', 'finalButton')
  phoneConfirm.innerHTML = "Select";
  phoneConfirm.addEventListener('click', Grasp.finalButtonHandler);
  Material.addMaterial('phoneConfirm', phoneConfirm, 4);

  main.appendChild(phoneConfirm);

  GraspChoreography.upAndStay([phoneGrid, phoneConfirm, helpText, sortOptions]);


}

Grasp.finalButtonHandler = function(){
  var main = document.getElementById('main');
  $('#appbar').addClass('green').removeClass('gray');
  //get rid of shiz
  var finalButton = $('#finalButton')[0];
  var helpText = $('#helpText')[0];
  var facets = $('.facetRow')[0];
  var phoneGrid = $('#phoneGrid')[0];
  var sort = $('.sortOptions')[0]
  GraspChoreography.upAndAway([facets, helpText, finalButton, phoneGrid, sort]);
  var finalPhoneGrid = buildDiv('phoneGrid final', 'finalGrid');
  //remove unselected phones
  for(var i = 0; i < Grasp.phones.length; i++){
    var phone = Grasp.phones[i];
    if(phone.pinned){
      phone.buildDisplay(finalPhoneGrid, true);
    }
  }
  main.appendChild(finalPhoneGrid);
  var finalText = buildDiv('centeredText');
  finalText.innerHTML = "Use your browser's built in features to print a copy of this page to take with you to a brick and mortar store, or to show to friends!"
  main.appendChild(finalText);
  //buildFinalReps of remainingPhones
  GraspChoreography.upAndStay([finalText, finalPhoneGrid])

}



Grasp.phoneControlHandler = function(event){
  var target = $(event.target).closest('.phoneControl')[0]
  var type = target.getAttribute('control');
  var phone = Grasp.phoneMap.get($(target).closest('.phoneContainer').attr('id'));
  if(type == 'check'){
    phone.togglePin();
  }else if(type == 'info'){
    phone.showWikipedia();
  }else if(type == 'write'){
//if we already have an annotation, we don't need another
    if($(target).closest('.phoneContainer').find('.annotationCont').length == 0){
      phone.openAnnotation();
    }
  }else{
    phone.remove();
  }
  event.stopPropagation();

}


Grasp.annotationIn = function(event){
  var phoneCont = $(event.target).closest('.phoneContainer');
  var phone = Grasp.phoneMap.get(phoneCont.attr('id'));
  var text = phoneCont.find('textarea').val()
  phone.userAnnotation = text;
  var text = phoneCont.find('.annotationCont').remove();

  document.body.removeEventListener('click', clickOnBodyAnn);
}
Grasp.annotationRemove = function(event){
  var phoneCont = $(event.target).closest('.phoneContainer');
  var phone = Grasp.phoneMap.get(phoneCont.attr('id'));
  var text = phoneCont.find('.annotationCont').remove();
  document.body.removeEventListener('click', clickOnBodyAnn);

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
