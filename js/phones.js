
var MAX_WIDTH = 77.8;
//price has to hard coded, unfortunately
function Phone(name, imageURL, displayName, price, carriers, brand, bestBuyURL, wikipediaURL, imageSearchURL, widthmm, heightmm){
    this.name = name;
    this.bestBuyURL = bestBuyURL;
    this.wikipediaURL = wikipediaURL;
    this.imageSearchURL =  imageSearchURL;
    this.imageURL = imageURL;
    this.displayName = displayName;
    this.miceContainerID = "MICE|" + name;
    this.miceContainer =  buildDiv('miceContainer', this.miceContainerID);
    this.bestBuyMDReady = false;
    this.googleImageMDReady = false;
    this.wikipediaRenderingReady = false;
    this.userAnnotation = "";
    this.pinned = false;
    this.brand = brand;
    this.carriers = carriers;
    this.price = price;
    this.widthmm = widthmm;
    this.heightmm = heightmm;
}

Phone.prototype.fetchMetadata = function(){
  var that = this;
  bsService.loadMetadata(that.bestBuyURL, null, function(err, result){
    if(err){
      console.log(err);
      return;
    }else{
      that.bestBuyMD = BSUtils.unwrap(result.metadata);
      that.bestBuyMDReady = true;
      console.log(that.displayName + "bb");

      try{
        //  this.features = this.bestBuyMD.features;
          that.rating = that.bestBuyMD.overall_rating;
          that.rating = that.rating.substring(0, 3);
      }
      catch(e){
        console.log(that.displayName + "bbERR");

      }
    }

  });

  bsService.loadMetadata(that.imageSearchURL, null, function(err, result){
    if(err){
      console.log(err);
      return;
    }else{
      that.googleImageMD = BSUtils.unwrap(result.metadata);
      that.googleImageMDReady = true;
      try{
          that.searchResults = that.googleImageMD.search_results;
          console.log(that.displayName + "gi");

      }
      catch(e){
        console.log(that.displayName + "giERR");
      }
    }

  });
}

Phone.prototype.buildDisplay = function(parent, final){
  if(final){
    $(this.container).empty();
  }
  var phoneContainer = buildDiv('phoneContainer', this.name);
  //materialSection
  var phoneMaterial = buildDiv('phone');
  Material.addMaterial('MATERIAL|' + this.name, phoneMaterial, 2);

  //label
  var phoneLabel = buildDiv('phoneLabel');
  var phoneName = buildDiv('phoneName');
  var phonePrice = buildDiv('phonePrice');
  var phoneRating = buildDiv('phoneRating');
  var ratingString = 'Rated <span class="phoneRatingHighlighted">' + this.rating + "</span> out of 5";
  phoneRating.innerHTML = ratingString;
  phoneName.innerHTML = this.displayName;
  phonePrice.innerHTML = this.price.toString();
  phoneLabel.appendChild(phoneName);
  phoneLabel.appendChild(phonePrice);
  phoneLabel.appendChild(phoneRating);
  phoneMaterial.appendChild(phoneLabel);
  //mainImage
  var phoneImage = document.createElement('img');
  phoneImage.className = "phoneImg";
  phoneImage.src = this.imageURL;
  //the image is scaled to be smaller based on width
  var widthPercent = this.widthmm / MAX_WIDTH;
  phoneImage.style.transform = "scale( " + widthPercent.toString() + ")"


  phoneMaterial.appendChild(phoneImage);
  phoneContainer.appendChild(phoneMaterial);
  if(!final){
    var controlRow = buildDiv('phoneControls');
    var check = buildDiv('phoneControl');
    check.innerHTML = '<i class="material-icons">bookmark</i>';
    check.addEventListener('click', Grasp.phoneControlHandler);
    check.setAttribute('control', 'check');
    controlRow.appendChild(check);

    var info = buildDiv('phoneControl');
    info.innerHTML = '<i class="material-icons">art_track</i>';
    info.addEventListener('click', Grasp.phoneControlHandler);
    info.setAttribute('control', 'info');
    controlRow.appendChild(info);

    var write = buildDiv('phoneControl');
    write.innerHTML = '<i class="material-icons">comment</i>';
    write.addEventListener('click', Grasp.phoneControlHandler);
    write.setAttribute('control', 'write');
    controlRow.appendChild(write);

    var remove = buildDiv('phoneControl');
    remove.innerHTML = '<i class="material-icons">remove</i>';
    remove.addEventListener('click', Grasp.phoneControlHandler);
    remove.setAttribute('control', 'remove');
    controlRow.appendChild(remove);

    phoneContainer.appendChild(controlRow);
  }else{
    var annotationRow = buildDiv('annotationOutput');
    annotationRow.innerHTML = '"' + this.userAnnotation + '"';
    phoneContainer.appendChild(annotationRow)
  }
  this.container = phoneContainer;
  parent.appendChild(phoneContainer);
}


//Prepares in memory phone objects.
//Sadly, a lot of info will be hard-coded
//We only provide about 12 phones - enough to demo the interface
function preparePhones(){
//name, imageURL, displayName, price, carriers, brand, bestBuyURL, wikipediaURL, imageSearchURL
  var nexus5x = new Phone("nexus5x", "./img/nexus5x.png",
  "Nexus 5X", 349.99, ["verizon", "att"], "nexus",
  "http://www.bestbuy.com/site/lg-google-nexus-5x-4g-with-16gb-memory-cell-phone-(unlocked)-white/4735200.p?id=1219809794681&skuId=4735200",
  "https://en.wikipedia.org/wiki/Nexus_5X",
  "https://www.google.com/search?site=&tbm=isch&source=hp&biw=1711&bih=1139&q=nexus+5x", 72.6, 147
  );
  var nexus6p = new Phone("nexus6p", "./img/nexus6p.png", "Nexus 6P", 499.99, ['verizon', 'att'], 'nexus',
  "http://www.bestbuy.com/site/huawei-nexus-6p-4g-with-32gb-memory-cell-phone-unlocked-aluminum/4796300.p?id=bb4796300&skuId=4796300", "https://en.wikipedia.org/wiki/Nexus_6P",
  "https://www.google.com/search?site=&tbm=isch&q=nexus+6p", 77.8, 159.3);
  var iphone5S = new Phone("iphone5s", "./img/iPhone5s.png", "iPhone 5S", 449.99, ["verizon", "att"], "apple",
  "http://www.bestbuy.com/site/apple-iphone-5s-16gb-cell-phone-unlocked-gray/2927219.p?id=1219083562088&skuId=2927219",
  "https://en.wikipedia.org/wiki/IPhone_5S",
  "https://www.google.com/search?site=&tbm=isch&source=hp&biw=1711&bih=1139&q=iPhone+5s&oq=iPhone+5s", 58.6, 123.8
  );
  var iphone6 = new Phone("iphone6", "./img/iphone6.png", "iPhone 6", 549.99, ["verizon", "att"], "apple",
  "http://www.bestbuy.com/site/apple-iphone-6-16gb-space-gray-sprint/7618003.p?id=1219288459356&skuId=7618003",
  "https://en.wikipedia.org/wiki/IPhone_6",
  "https://www.google.com/search?site=&tbm=isch&source=hp&biw=1711&bih=1139&q=iPhone+6&oq=iPhone+6", 67, 138.1

  );
  var iphone6Splus = new Phone("iphone6s", "./img/iphone6.png", "iPhone 6S Plus", 749.99, ["verizon", "att"], "apple",
  "http://www.bestbuy.com/site/apple-iphone-6s-plus-64gb-rose-gold-verizon-wireless/4452100.p?id=bb4452100&skuId=4452100",
  "https://en.wikipedia.org/wiki/IPhone_6S",
  "https://www.google.com/search?site=&tbm=isch&source=hp&biw=1711&bih=1139&q=iPhone+6s+plus&oq=iPhone+6s+plus", 77.8, 158.1
  );
  var htcWindows = new Phone("htcwindows", "./img/htcm8.png", "HTC One (M8)", 479.99, ["verizon"], "htc",
  "http://www.amazon.com/HTC-M8-Windows-Gunmetal-Wireless/dp/B00M7DFJ0O/ref=sr_1_1?s=wireless&ie=UTF8&qid=1457211355&sr=1-1&keywords=htc+one+m8+windows",
  "https://en.wikipedia.org/wiki/HTC_One_(M8)",
  "https://www.google.com/search?site=&tbm=isch&source=hp&biw=1711&bih=1139&q=htc+one+m8+windows", 70.6, 146.4)
  var htconem9 = new Phone("htconem9", "./img/htcm9.png", "HTC One (M9)", 649.99, ["verizon", "att"], "htc",
  "http://www.bestbuy.com/site/htc-one-m9-4g-with-32gb-memory-cell-phone-gray-verizon-wireless/4376032.p?id=1219629026190&skuId=4376032",
  "https://en.wikipedia.org/wiki/HTC_One_M9",
  "https://www.google.com/search?site=&tbm=isch&source=hp&biw=1711&bih=1139&q=htc+one+m9+&oq=htc+one+m9+", 69.7, 148.6);

  var htca9 = new Phone('htca9', './img/htca9.png', "HTC A9", 499.99, ['att'], 'htc',
  'http://www.bestbuy.com/site/htc-one-a9-with-32gb-memory-cell-phone-white-sprint/4611800.p?id=bb4611800&skuId=4611800',
  'https://en.wikipedia.org/wiki/HTC_One_A9',
  'https://www.google.com/search?site=&tbm=isch&source=hp&biw=1711&bih=1139&q=htc+a9&oq=htc+a9', 70, 145.75);
  //the a9's rating is not available on best buy for some reason
  Grasp.phones.push(nexus5x);
  Grasp.phones.push(nexus6p);
  Grasp.phones.push(iphone5S);
  Grasp.phones.push(iphone6);
  Grasp.phones.push(iphone6Splus);
  Grasp.phones.push(htcWindows);
  Grasp.phones.push(htconem9);
  Grasp.phones.push(htca9);
  Grasp.phoneMap.put(nexus5x.name, nexus5x);
  Grasp.phoneMap.put(nexus6p.name, nexus6p);
  Grasp.phoneMap.put(iphone5S.name, iphone5S);
  Grasp.phoneMap.put(iphone6.name, iphone6);
  Grasp.phoneMap.put(iphone6Splus.name, iphone6Splus);
  Grasp.phoneMap.put(htcWindows.name, htcWindows);
  Grasp.phoneMap.put(htconem9.name, htconem9);
  Grasp.phoneMap.put(htca9.name, htca9);

  for(var i = 0; i < Grasp.phones.length; i++){
    Grasp.phones[i].fetchMetadata();

  }
}
function clickOnBody(event){
  var possibleParent = $(event.target).closest('.miceContainer');
  if(possibleParent.length > 0){
    event.stopPropagation();
    return;
  }else{
      $('.miceContainer').css('display', 'none');
      document.body.removeEventListener('click', clickOnBody);
  }
}
function clickOnBodyAnn(event){
  var possibleParent = $(event.target).closest('.annotationCont');
  if(possibleParent.length > 0){
    event.stopPropagation();
    return;
  }else{
      $('.annotationCont').css('display', 'none');
      document.body.removeEventListener('click', clickOnBodyAnn);
  }
}

Phone.prototype.openAnnotation= function(){
  var textCont = buildDiv('annotationCont');
  var textIn = document.createElement('textarea');
  textIn.rows = 2;
  textIn.cols = 50;
  textIn.className = "annotate";
  textIn.innerHTML = this.userAnnotation;
  var textControls = buildDiv('textControls');

  var check = buildDiv('phoneControl');
  check.innerHTML = '<i class="material-icons">check</i>';
  check.addEventListener('click', Grasp.annotationIn);
  textControls.appendChild(check);
  var cancel = buildDiv('phoneControl');
  cancel.innerHTML = '<i class="material-icons">cancel</i>';
  cancel.addEventListener('click', Grasp.annotationRemove);
  textControls.appendChild(cancel);
  textCont.appendChild(textIn);
  textCont.appendChild(textControls);
  this.container.appendChild(textCont);

  Material.addMaterial('ANN' + this.name, textCont, 8);

}

Phone.prototype.togglePin = function(){
  if(this.pinned){
    $(this.container).find('.phone').toggleClass('selected');
    this.pinned = !this.pinned;
    Grasp.pinnedPhones = Grasp.pinnedPhones - 1;
  }else{
    if(Grasp.pinnedPhones >= 2){
      $(this.container).addClass('nope');
      this.container.addEventListener('animationend', GraspChoreography.removeAnimation);
    }else{
      $(this.container).find('.phone').toggleClass('selected');
      this.pinned = !this.pinned;
      Grasp.pinnedPhones = Grasp.pinnedPhones + 1;

    }
  }

  if(Grasp.pinnedPhones > 0){
    $('#finalButton').removeClass('unselectable');
  }else{
    $('#finalButton').addClass('unselectable');

  }
}

Phone.prototype.remove = function(){
  GraspChoreography.upAndAway([this.container]);
  this.removed = true;
}


Phone.prototype.showWikipedia = function(){
  if(this.wikipediaRenderingReady){
    $(this.miceContainer).css('display', '');
    event.stopPropagation();

    document.body.addEventListener('click', clickOnBody);

  }else{
    this.container.appendChild(this.miceContainer);
    this.miceContainer.innerHTML = "<img class='gif' src='./img/loading.gif' ></img>";
    $(this.miceContainer).addClass('loading');
    var that = this;
    RendererBase.addMetadataDisplay(this.miceContainer, this.wikipediaURL, null, MICE.render, {callback: function(){
      $(that.miceContainer).removeClass('loading');

      that.wikipediaRenderingReady = true;
      Material.addMaterial(that.miceContainer, that.miceContainer, 8);
      document.body.addEventListener('click', clickOnBody);
    }});
  }
}
