import {Router} from 'express';
import {shopData,itemData,reviewData, flagData, userData} from '../data/index.js'
import {intCheck, sortLev} from '../valid.js'
import xss from "xss";
import * as valid from "../valid.js";
const router = Router();
import dotenv from 'dotenv'
dotenv.config();
//basic stuff to render home file can change to to a different route in the future this is just for rendering the home page
router.route('/').get(async (req, res) => {
  try{
    const themeType = req.session.user && req.session.user.themeType ? req.session.user.themeType : 'light';
    res.render('home', {
      title: "LeBobaQuest",
      loggedIn: req.session.user,
      themeType: themeType
    });
  }catch(e){
    res.sendStatus(500);
  }
});
 
router.route('/map').get(async (req, res) => {
  try {
    const pins = await valid.getPins()
    let cord 
    if(req.session.user){
      cord = await valid.getLatLong(xss(req.session.user.address));
    }
    else{
      cord = await valid.getLatLong("529 Washington Street, Hoboken");
    }
    const themeType = req.session.user && req.session.user.themeType ? req.session.user.themeType : 'light';   
    res.render('map', {
      title: "Map",
      lat: cord.lat,
      long: cord.lng,
      shops: JSON.stringify(pins),
      keys: process.env.GOOGLE_MAPS_KEY,
      themeType: themeType,
      loggedIn: req.session.user
    });
  } catch (e) {
    console.log(e);
    res.status(500).send("Internal Server Error");
  }
})
.post(async (req, res) => {
  let address
  let distance
  let pins
  const themeType = req.session.user && req.session.user.themeType ? req.session.user.themeType : 'light';
  try{
    if(xss(req.body.address)){
      address = valid.stringValidate(xss(req.body.address))
      address = await valid.getLatLong(address);
    }
    else{
      if(req.session.user){
        address = await valid.getLatLong(xss(req.session.user.address));
      }
      else{
        address = await valid.getLatLong("529 Washington Street, Hoboken");
      }
    }
    pins = await valid.getPins()
    if(xss(req.body.distance)){
      distance = await valid.stringValidate(req.body.distance)
      distance = parseInt(distance)
      pins = pins.filter(coord => {
        const currDistance = valid.haversineDistance(address.lat, address.lng, coord.position.lat, coord.position.lng);
        return currDistance < distance;
      });
    }
  }
  catch(e){
    return res.status(400).render("Map", {
      error: e.toString(),
      title: "Map",
      themeType: themeType,
      loggedIn: req.session.user
    });
  }
  try{
    res.json({
      lat: address.lat,
      lng: address.lng,
      shops: pins
    });
    } catch (e) {
        console.log(e);
        res.status(500).send("Internal Server Error");
    }
});

router
  .route('/shop/addShop')
  .get(async (req, res) => {
    const themeType = req.session.user && req.session.user.themeType ? req.session.user.themeType : 'light';
    res.render('addShop', {title: "Add Shop", loggedIn: req.session.user, themeType: themeType});
  })
  .post(async (req, res) => {
    let ownerId
    let shopName
    let address
    let website
    let phoneNumber
    let userId
    let customizationObj = {
      size_options: false,
      ice_level: false,
      sugar_level: false,
      customization_charge: false
    }
    const themeType = req.session.user && req.session.user.themeType ? req.session.user.themeType : 'light';
    try{
      shopName = valid.stringValidate(xss(req.body.shopName))
      address = valid.stringValidate(xss(req.body.address))
      website = valid.urlCheck(xss(req.body.website))
      phoneNumber = valid.phoneNumberCheck(xss(req.body.phoneNumber))
      userId = valid.idCheck(xss(req.session.user.id))
        if(xss(req.body.size_options) === "on"){
          customizationObj.size_options = true
        }
        else if(xss(req.body.ice_level) === "on"){
          customizationObj.ice_level = true
        }
        else if(xss(req.body.sugar_level) === "on"){
          customizationObj.sugar_level = true
        }
        else if(xss(req.body.customization_charge) === "on"){
          customizationObj.customization_charge = true
        }
      if(req.body.ownerId){
        ownerId = valid.idCheck(xss(req.body.ownerId))
      }
      if(!xss(req.body.hour1) || !xss(req.body.hour2) || !xss(req.body.minute1) || !xss(req.body.minute2) || !xss(req.body.ampm1) || !xss(req.body.ampm2)){
        throw 'invalid date'
      }
    }
    catch(e){
      return res.status(400).render("addShop", {
        error: e.toString(),
        title: "Add Shop",
        shopName: shopName,
        address: address,
        website: website,
        phoneNumber: phoneNumber,
        ownerId: ownerId,
        themeType: themeType,
        loggedIn: req.session.user
      });
    }
    try {
      const shop = await shopData.createShop(
        shopName,
        address,
        website,
        phoneNumber,
        req.body.hour1,
        req.body.minute1,
        req.body.ampm1,
        req.body.hour2,
        req.body.minute2,
        req.body.ampm2,
        customizationObj,
        ownerId
      )
      const updatedUser = await userData.updatePoints(userId, 50)
      return res.redirect(`/shop/${shop._id}`)
    } catch (error) {
      return res.status(500).render("addShop", {
              error: error.toString(),
              title: "Add Shop",
              shopName: shopName,
              address: address,
              website: website,
              phoneNumber: phoneNumber,
              ownerId: ownerId,
              themeType: themeType,
              loggedIn: req.session.user
            });
    }
  })

router.route('/shops/search').post(async (req, res) => {
  const themeType = req.session.user && req.session.user.themeType ? req.session.user.themeType : 'light';
  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  const currentMin = currentTime.getMinutes();
  try{
    const shops = await shopData.getAllShops();
    const search = xss(req.body.shop);
    let minLikes = xss(req.body.minLikes)
    let minRating = xss(req.body.minRating)
    let minReviews = xss(req.body.minReviews)
    let sortShops = sortLev(shops,search);
    let gluten = xss(req.body.gluten)
    let dairy = xss(req.body.dairy)
    let peanuts = xss(req.body.peanuts)
    let treenuts = xss(req.body.treenuts)
    let sesame = xss(req.body.sesame)
    let mustard = xss(req.body.mustard)
    let soy = xss(req.body.soy)
    let eggs = xss(req.body.eggs)
    let fish = xss(req.body.fish)
    let shellfish = xss(req.body.shellfish)
    let itemKeyWord = xss(req.body.itemKeyWord)
    let allergens = []
    if(gluten){
      allergens.push("gluten")
    }
    if(dairy){
      allergens.push("dairy")
    }
    if(peanuts){
      allergens.push("peanuts")
    }
    if(treenuts){
      allergens.push("treenuts")
    }
    if(sesame){
      allergens.push("sesame")
    }
    if(mustard){
      allergens.push("mustard")
    }
    if(soy){
      allergens.push("soy")
    }
    if(eggs){
      allergens.push("eggs")
    }
    if(fish){
      allergens.push("fish")
    }
    if(shellfish){
      allergens.push("shellfish")
    }
    if (allergens.length > 0) {
      let index;
      for (let i = 0; i < sortShops.length; i++) {
        const shop = sortShops[i];
        let currAllergen = []
        for (let j = 0; j < shop.items.length; j++) {
          currAllergen = [...allergens];
          const item = shop.items[j];
          for (let k = 0; k < currAllergen.length; k++) {
            const allergen = currAllergen[k];
            if (!item.allergens.includes(allergen)) {
              index = currAllergen.indexOf(allergen);
              if (index !== -1) {
                currAllergen.splice(index, 1);
              }
            }
          }
        }
        if (currAllergen.length > 0) {
          sortShops.splice(i, 1);
          i--;
        }
      }
    }
    if(itemKeyWord){
      for (let i = 0; i < sortShops.length; i++) {
        let hasItem = true
        const shop = sortShops[i];
        for (let j = 0; j < shop.items.length; j++) {
          const item = shop.items[j];
          if (item.name.includes(itemKeyWord)) {
            hasItem = false;
            break;
          }
        }
        if (hasItem) {
          sortShops.splice(i, 1);
          i--;
        }
      }
    }
    if(minRating){
      if(req.body.minRating > 0){
        sortShops = sortShops.filter((shop) => ((shop.averageRating >= minRating) && (shop.averageRating != "No Ratings")));
      }
    }
    if(minRating){
      sortShops = sortShops.filter((shop) => (shop.numOfLikes >= minLikes));
    }
    if(minReviews){
      sortShops = sortShops.filter((shop) => (shop.reviews.length >= minReviews));
    }
    let Distance = false
    if(req.session.user){
      Distance = true
      sortShops = await valid.getDistances(sortShops, req.session.user.address)
    }
    for(const shop of sortShops){
      if(shop.flags.length >= 10){
        shop.flagged = true
      }
    }
    res.render('shopSearchResults', {title:"Search Results", shops: sortShops, loggedIn: req.session.user, search: search, themeType: themeType, currentHour: currentHour, currentMin: currentMin, Distance: Distance});
  }catch(e){
    console.log(e)
    res.status(500).render('error', {title: "Search Results", error: e, themeType: themeType, loggedIn: req.session.user});
  }
})

router.route('/shops/bookmarks').get(async (req,res) => {
  const themeType = req.session.user && req.session.user.themeType ? req.session.user.themeType : 'light';
  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  const currentMin = currentTime.getMinutes();
  try{
    const shops = await shopData.getAllShops();
    let bmShops = shops.filter((shop) => (xss(req.session.user.bookmarks)).includes(shop._id.toString()));
    bmShops = await valid.getDistances(bmShops, req.session.user.address)
    for(const shop of bmShops){
      if(shop.flags.length >= 10){
        shop.flagged = true
      }
    }
    res.render('bookmarks', {title:"Bookmarks", shops: bmShops, loggedIn: req.session.user, themeType: themeType, currentHour: currentHour, currentMin: currentMin});
  }catch(e){
    res.status(500).render('error', {title: "Bookmarks", error: e, themeType: themeType, loggedIn: req.session.user});
  }
})

router.route('/shops/claimed').get(async (req,res) => {
  const themeType = req.session.user && req.session.user.themeType ? req.session.user.themeType : 'light';
  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  const currentMin = currentTime.getMinutes();
  try{
    const shops = await shopData.getAllShops();
    let bmShops = shops.filter((shop) => xss(req.session.user.id) === shop.ownerId);
    bmShops = await valid.getDistances(bmShops, req.session.user.address)
    for(const shop of bmShops){
      if(shop.flags.length >= 10){
        shop.flagged = true
      }
    }
    res.render('bookmarks', {title:"Owned Shops", shops: bmShops, loggedIn: req.session.user, themeType: themeType, currentHour: currentHour, currentMin: currentMin});
  }catch(e){
    res.status(500).render('error', {title: "Owned Shops", error: e, themeType: themeType, loggedIn: req.session.user});
  }
})

router.route('/shop/:id').get(async (req, res) => {
  const search = (xss(req.params.id)).trim();
  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  const currentMinute = currentTime.getMinutes();
  const themeType = req.session.user && req.session.user.themeType ? req.session.user.themeType : 'light';
  if(!search || (search.trim().length === 0)){
    return res.status(400).render('error', {title: "Shop Page", error: 'Must input search id', themeType: themeType, loggedIn: req.session.user});
  } 
  try {
    const searchResult = await shopData.getShop(search);
    if (!searchResult.name){
      return res.status(404).render('error',{title: "Shop Page", error: `No shop with ID ${search} found`, themeType: themeType, loggedIn: req.session.user});
    }
    const storeItems = await searchResult.items;
    const storeReviewsPromises = searchResult.reviews.map(async (review) => await reviewData.getReview(review.toString()));
    const storeReviews = await Promise.all(storeReviewsPromises);
    let inBookmarks = false
    if(req.session.user){
      inBookmarks = (xss(req.session.user.bookmarks)).includes(search)
    }
    let flagged = false
    let flagcount = searchResult.flags.length
    if(searchResult.flags.length >= 10){
      flagged = true 
    }
    let Default = false
    let noOwner = false
    let isOwner = false
    let Admin = false
    let Business = false
    if(req.session.user){
      if(req.session.user.accountType === "Default"){
        Default = true
      }
      if(req.session.user.accountType === "Admin"){
        Admin = true
      }
      if(req.session.user.accountType === "Business"){
        Business = true
      }
      if(searchResult.ownerId === ""){
        noOwner = true
      }
      else{
        if(searchResult.ownerId === req.session.user.id){
          isOwner = true
        }
      }
    }
    let newestReviews = [];
    for(let review of storeReviews.slice(0,5)){
      newestReviews.push(review);
    }
    newestReviews.reverse();
    const trueKeys = Object.keys(searchResult.customization).filter(key => searchResult.customization[key]);
    const filteredData = {};
    trueKeys.forEach(key => {
      filteredData[key] = true; 
    });
    const filteredDataString = JSON.stringify(filteredData);
    let cleanedString = filteredDataString.replace(/[{}]/g, '').replaceAll(':true', '');
    cleanedString = cleanedString.replace(/[{}]/g, '').replaceAll(':true', '').replaceAll('"', '').replaceAll('_', ' ').replaceAll(',', ' ');
    cleanedString = cleanedString.toLowerCase().replace(/\b\w/g, function(char) {
      return char.toUpperCase();
    });
    if(req.session.user){
      const userAddress = await valid.getLatLong(req.session.user.address);
      const cords = await valid.getLatLong(searchResult.address);
      let currDistance = valid.haversineDistance(userAddress.lat, userAddress.lng, cords.lat, cords.lng);
      currDistance = currDistance.toFixed(1);
      searchResult.distance = currDistance
    }
    res.render('shopPage', {title: searchResult.name, shop:searchResult, items:storeItems, reviews:newestReviews,
      loggedIn: req.session.user, inBookmarks: inBookmarks, flagged: flagged, Default: Default, isOwner: isOwner, 
      noOwner: noOwner, themeType: themeType, currentHour: currentHour, currentMin: currentMinute, Admin: Admin, customList: cleanedString, flagcount: flagcount, Business: Business});
  } catch(e){
    res.status(500).render('error',{title: "Shop Page", error: e, loggedIn: req.session.user, themeType: themeType});
  }
})
.post(async (req, res) => {
  let userId 
  let shopId
  const themeType = req.session.user && req.session.user.themeType ? req.session.user.themeType : 'light';
  try{
    userId = valid.idCheck(xss(req.session.user.id)) 
    shopId = valid.idCheck(xss(req.params.id))
  }catch(e){
    return res.status(400).render('shopPage', {
      title: "Shop Page",
      error: e.toString(),
      themeType: themeType,
      loggedIn: req.session.user
    })    
  }
  try{
    const user = await userData.getUser(userId)
    let updatedLike
    if(!user.bookmarks.includes(shopId)){
      updatedLike = await userData.likeShop(userId, shopId)
    }
    else{
      updatedLike  = await userData.unlikeShop(userId, shopId)
    }
    req.session.user.bookmarks = updatedLike.bookmarks 
    return res.redirect(`/shop/${shopId}`)
  }catch(e){
    return res.status(500).render('shopPage', {
      title: "Shop Page",
      error: e.toString(), 
      themeType: themeType,
      loggedIn: req.session.user
    })  
  }
});

router
.route('/shop/:id/edit').post(async (req, res) => {
  let ownerId
  let shopName
  let address
  let website
  let phoneNumber
  let shopId
  const themeType = req.session.user && req.session.user.themeType ? req.session.user.themeType : 'light';
  let customizationObj = {
    size_options: false,
    ice_level: false,
    sugar_level: false,
    customization_charge: false
  }
  try{
    shopId = valid.idCheck(xss(req.params.id))
    shopName = valid.stringValidate(xss(req.body.shopName))
    address = valid.stringValidate(xss(req.body.address))
    website = valid.urlCheck(xss(req.body.website))
    phoneNumber = valid.phoneNumberCheck(xss(req.body.phoneNumber))
    if(xss(req.body.size_options) === "on"){
      customizationObj.size_options = true
    }
    else if(xss(req.body.ice_level) === "on"){
      customizationObj.ice_level = true
    }
    else if(xss(req.body.sugar_level) === "on"){
      customizationObj.sugar_level = true
    }
    else if(xss(req.body.customization_charge) === "on"){
      customizationObj.customization_charge = true
    }
    if(!xss(req.body.hour1) || !xss(req.body.hour2) || !xss(req.body.minute1) || !xss(req.body.minute2) || !xss(req.body.ampm1) || !xss(req.body.ampm2)){
      throw 'invalid date'
    }
  }
  catch(e){
    console.log(e)
    return res.status(400).render("shopPage", {
      error: e.toString(),
      title: "Shop Page",
      shopName: shopName,
      address: address,
      website: website,
      phoneNumber: phoneNumber,
      ownerId: ownerId,
      themeType: themeType,
      loggedIn: req.session.user
    });
  }
  try {
    let updateObject = {
      shopName: shopName,
      address: address,
      website: website,
      phoneNumber: phoneNumber,
      hour1: req.body.hour1,
      minute1: req.body.minute1,
      ampm1: req.body.ampm1,
      hour2: req.body.hour2,
      minute2: req.body.minute2,
      ampm2: req.body.ampm2,
      customization: customizationObj
    }
    const shop = await shopData.updateShop(
      shopId,
      updateObject
    )
    return res.redirect(`/shop/${shop._id}`)
  } catch (error) {
    console.log(error)
    return res.status(500).render("shopPage", {
            error: error.toString(),
            title: "Shop Page",
            shopName: shopName,
            address: address,
            website: website,
            phoneNumber: phoneNumber,
            ownerId: ownerId,
            themeType: themeType,
            loggedIn: req.session.user
          });
  }
})

router.route('/shop/:id/user/claim')
.post(async (req, res) => {
  const themeType = req.session.user && req.session.user.themeType ? req.session.user.themeType : 'light';
  let shopId
  let shop
  try{
    shopId = valid.idCheck(xss(req.params.id))
  }
  catch(e){
    console.log(e)
    return res.status(400).render("shopPage", {
      error: e.toString(),
      title: "Shop Page",
    });
  }
  try{
    shop = await shopData.getShop(shopId)
    if(req.session.user){
      if(req.session.user.accountType === "Business"){
        shop.ownerId = req.session.user.id
      }
      else{
        throw 'needs to be a business account'
      }
    }
    else{
      throw 'need to be logged in'
    }
    shopData.updateShop(shopId, shop)
    return res.redirect(`/shop/${shop._id}`)
  } catch (error) {
    console.log(error)
    return res.status(500).render("shopPage", {
            error: error.toString(),
            title: "Shop Page",
          });
  }
});

router.route('/shop/:id/flags')
.get(async (req, res) => {
  let shopId
  const themeType = req.session.user && req.session.user.themeType ? req.session.user.themeType : 'light';
  try{
    shopId = valid.idCheck(xss(req.params.id))
  }
  catch(e){
    return res.status(400).render("shopFlags", {
      error: e.toString(),
      title: "Shop Flags",
      themeType: themeType,
      loggedIn: req.session.user
    });
  }
  try {
    const shop = await shopData.getShop(shopId)
    const flags = shop.flags
    return res.status(200).render("shopFlags", {
      title: "Shop Flags",
      themeType: themeType,
      flags: flags,
      shop: shop,
      loggedIn: req.session.user
    })
  } catch (error) {
    return res.status(500).render("shopFlags", {
            error: error.toString(),
            title: "Shop Flags",
            themeType: themeType,
            loggedIn: req.session.user
          });
  }
})

router.route('/shop/:id/delete')
.post(async (req, res) => {
  let shopId
  const themeType = req.session.user && req.session.user.themeType ? req.session.user.themeType : 'light';
  try{
    shopId = valid.idCheck(xss(req.params.id))
  }
  catch(e){
    return res.status(400).render("shopPage", {
      error: e.toString(),
      title: "Shop",
      themeType: themeType,
      loggedIn: req.session.user
    });
  }
  try {
    const info = await shopData.removeShop(shopId)
    return res.redirect(`/shops`)
  } catch (error) {
    return res.status(500).render("shopPage", {
            error: error.toString(),
            title: "Shop",
            themeType: themeType,
            loggedIn: req.session.user
          });
  }
})

router
  .route('/shop/:shopId/itemForm')
  .get(async (req, res) => {
    const themeType = req.session.user && req.session.user.themeType ? req.session.user.themeType : 'light';
    try{
      const searchResult = await shopData.getShop(xss(req.params.shopId)); 
      if (!searchResult.name){
        throw 'lebron james'
      }
      res.render("itemForm", {
        title: "Item Form",
        shop: searchResult,
        loggedIn: req.session.user,
        themeType: themeType,
      });
    }catch(e){
      console.log(e);
      res.status(500).render('error', {title: "Item Form", error: "Internal Server Error", loggedIn: req.session.user, themeType: themeType});
    }
  })
  .post(async (req, res) => {
    let shopId, name, description, price, tags, allergens, userId, calories
    const themeType = req.session.user && req.session.user.themeType ? req.session.user.themeType : 'light';
    try{
      shopId = valid.idCheck(xss(req.params.shopId))
      name = valid.stringValidate(xss(req.body.name), "name")
      description = valid.stringValidate(xss(req.body.description), "description")
      price = xss(req.body.price)
      price = parseFloat(price)
      valid.checkPrice(price)
      calories = xss(req.body.calories)
      calories = parseInt(calories)
      valid.intCheck(calories)
      tags = (xss(req.body.tags)).trim()
      tags = valid.arrayOfStrings(tags.split(","))
      allergens = (xss(req.body.allergens)).trim()
      allergens = valid.arrayOfStrings(allergens.split(","))
      userId = valid.idCheck(xss(req.session.user.id))
    }
    catch(e){
      return res.status(400).render('error', {title: "Item Form", error: e, themeType: themeType, loggedIn: req.session.user});
    }
    try {
      const item = await itemData.createItem(
        shopId,
        name,
        description,
        price,
        tags,
        allergens,
        calories
      )
      const updatedUser = await userData.updatePoints(userId, 20)
      return res.redirect(`/shop/${shopId}/item/${item._id.toString()}`)
    } catch (error) {
      console.log(error);
      return res.status(500).render('error', {error: "Internal Server Error", themeType: themeType, loggedIn: req.session.user});
    }
  })

router
  .route('/shop/:shopId/reviewForm')
  .post(async (req, res) => {
    let shopId
    let userId
    let title
    let rating
    let review
    const themeType = req.session.user && req.session.user.themeType ? req.session.user.themeType : 'light';
    try{
      userId = valid.idCheck(xss(req.session.user.id));
      shopId = valid.idCheck(xss(req.params.shopId));
      title = valid.stringValidate(xss(req.body.title), "title");
      rating = parseInt(xss(req.body.rating));
      intCheck(rating);
      review = valid.stringValidate(xss(req.body.review), "review");
    }
    catch(e){
      console.log(e);
      res.status(504).redirect(`/shop/${xss(req.params.shopId)}`);
    }
    try {
      const rev = await reviewData.createReview(
        userId,
        shopId,
        title,
        rating,
        review,
        'shop'
      )
      const updatedUser = await userData.updatePoints(userId, 10)
      return res.redirect(`/review/${rev._id}`)
    } catch(e) {
      console.log("fsadlfjaoifnoiashpodfi");
      res.status(500).render('error', {title: "Review Form", error: "Internal Server Error", loggedIn: req.session.user, themeType: themeType})
    }
  })

router
  .route('/shop/:shopId/flagForm')
  .get(async (req, res) => {
    const id = xss(req.params.shopId)
    const themeType = req.session.user && req.session.user.themeType ? req.session.user.themeType : 'light';
    res.render("flagForm", {title: "Flag Form", id: id, loggedIn: req.session.user, themeType: themeType});
  })
  .post(async (req, res) => {
    let shopId
    let userId
    let flagReason
    const themeType = req.session.user && req.session.user.themeType ? req.session.user.themeType : 'light';
    try{
      userId = valid.idCheck(xss(req.session.user.id))
      shopId = valid.idCheck(xss(req.params.shopId))
      flagReason = valid.stringValidate(xss(req.body.description))
    }
    catch(e){
      return res.status(400).render("flagForm", {
        error: e.toString(),
        title: "Flag Form",
        flagReason: flagReason,
        themeType: themeType,
        loggedIn: req.session.user
      });
    }
    try {
      const flag = await flagData.createFlag(
        shopId,
        userId,
        flagReason
      )
      return res.redirect(`/shop/${shopId}/flag/${flag._id}`)
    } catch (error) {
      return res.status(500).render("flagForm", {
              error: e.toString(),
              title: "Flag Form",
              flagReason: flagReason,
              themeType: themeType,
              loggedIn: req.session.user
            });
    }
  })

router
  .route('/shop/:shopId/flag/:flagId')
  .get(async (req, res) => {
    let shopId
    let flagId
    const themeType = req.session.user && req.session.user.themeType ? req.session.user.themeType : 'light';
    try {
      shopId = valid.idCheck(xss(req.params.shopId))
      flagId = valid.idCheck(xss(req.params.flagId))
    } catch (e) {
      return res.status(400).json({error: e});
    }
    try {
      const flag = await flagData.getFlag(flagId)
      const shop = await shopData.getShop(shopId)
      return res.render("flag", {
        title: "Flag",
        flag: flag,
        shop: shop,
        themeType: themeType,
        loggedIn: req.session.user});
    } catch (e) {
      return res.status(500).json({error: e});
    }
  });

router
  .route('/shop/:shopId/flag/:flagId/delete')
  .post(async (req, res) => {
    let shopId 
    let flagId
    try {
      shopId = valid.idCheck(xss(req.params.shopId))
      flagId = valid.idCheck(xss(req.params.flagId))
    } catch (e) {
      return res.status(400).json({error: e});
    }
    try {
      const flag = await flagData.deleteFlag(flagId);
      return res.redirect(`/shop/${shopId}`)
    } catch (e) {
      return res.status(404).json({error: e});
    }
  });

router
  .route('/shop/:shopId/item/:itemId')
  .get(async (req, res) => {
    const themeType = req.session.user && req.session.user.themeType ? req.session.user.themeType : 'light';
    let shopId
    let itemId
    try {
      shopId = valid.idCheck(xss(req.params.shopId))
      itemId = valid.idCheck(xss(req.params.itemId))
    } catch (e) {
      return res.status(400).json({error: e});
    }
    try {
      const shop = await shopData.getShop(shopId);
      const item = await itemData.getItem(itemId);
      let Default = false
      let Admin = false
      let isOwner = false
      if(req.session.user){
        if(req.session.user.accountType === "Default"){
          Default = true
        }
        if(req.session.user.accountType === "Admin"){
          Admin = true
        }
        if(req.session.user.id === shop.ownerId){
          isOwner = true
        }
      }
      const itemReviewsPromises = item.reviews.map(async (review) => await reviewData.getReview(review.toString()));
      const itemReviews = await Promise.all(itemReviewsPromises);
      let highestReviews = [];
      let lowestReviews = [];
      let newestReviews = [];
      for(let review of itemReviews){
        highestReviews.push(review);
        lowestReviews.push(review);
        newestReviews.push(review);
      }
      highestReviews.sort(function(a,b){return  b.rating - a.rating});
      lowestReviews.sort(function(a,b){return  a.rating - b.rating});
      newestReviews.reverse();
      return res.status(200).render("item", {
        title: item.name,
        item: item,
        shop: shop,
        loggedIn: req.session.user,
        themeType: themeType,
        Default: Default,
        Admin: Admin,
        reviews: itemReviews,
        lowestReviews: lowestReviews,
        highestReviews: highestReviews,
        newestReviews: newestReviews,
        isOwner: isOwner
      });
    } catch (e) {
      console.log(e)
      return res.status(404).json({error: e});
    }
  })
  .post(async (req, res) => {
    let itemId
    let userId
    let title
    let rating
    let review
    const themeType = req.session.user && req.session.user.themeType ? req.session.user.themeType : 'light';
    try{
      userId = valid.idCheck(xss(req.session.user.id));
      itemId = valid.idCheck(xss(req.params.itemId));
      title = valid.stringValidate(xss(req.body.title), "title");
      rating = parseInt(xss(req.body.rating));
      intCheck(rating);
      review = valid.stringValidate(xss(req.body.review), "review");
    }
    catch(e){
      console.log(e);
      res.status(504).redirect(`/shop/${xss(req.params.shopId)}/item/${xss(req.params.itemId)}`);
    }
    try {
      const rev = await reviewData.createReview(
        userId,
        itemId,
        title,
        rating,
        review,
        'item'
      )
      const updatedUser = await userData.updatePoints(userId, 10)
      return res.redirect(`/review/${rev._id}`)
    } catch(e) {
      res.status(500).render('error', {title: "Review", error: "Internal Server Error", loggedIn: req.session.user, themeType: themeType})
    }
  })


router
  .route('/shop/:shopId/item/:itemId/delete')
  .post(async (req, res) => {
    let shopId 
    let itemId
    try {
      shopId = valid.idCheck(xss(req.params.shopId))
      itemId = valid.idCheck(xss(req.params.itemId))
    } catch (e) {
      return res.status(400).json({error: e});
    }
    try {
      const item = await itemData.deleteItem(itemId);
      return res.redirect(`/shop/${shopId}`)
    } catch (e) {
      return res.status(404).json({error: e});
    }
  });
  
router.route('/shop/:shopId/item/:itemId/edit')
  .post(async (req, res) => {
    console.log(1)
    let shopId
    let name
    let description
    let price
    let tags
    let allergens
    let updateItem
    let itemId
    let calories
    const themeType = req.session.user && req.session.user.themeType ? req.session.user.themeType : 'light';
    try{
      shopId = valid.idCheck(xss(req.params.shopId))
      itemId = valid.idCheck(xss(req.params.itemId))
      name = valid.stringValidate(xss(req.body.name))
      description = valid.stringValidate(xss(req.body.description))
      price = xss(req.body.price)
      price = parseFloat(price)
      valid.numCheck(price)
      if(price <= 0){
        throw 'invalid pricing'
      }
      calories = xss(req.body.calories)
      calories = parseInt(calories)
      valid.intCheck(calories)
      if(calories < 0){
        throw 'invalid calories'
      }
      tags = (xss(req.body.tags)).trim()
      tags = valid.arrayOfStrings(tags.split(","))
      allergens = (xss(req.body.allergens)).trim()
      allergens = valid.arrayOfStrings(allergens.split(","))
      updateItem = {
        name,
        description,
        price,
        tags,
        allergens,
        calories
      }
    }
    catch(e){
      console.log(e)
      return res.status(400).render("item", {
        error: e.toString(),
        title: "Item Error",
        themeType: themeType,
        loggedIn: req.session.user
      });
    }
    try {
      const item = await itemData.updateItem(
        itemId,
        updateItem
      )
      return res.redirect(`/shop/${shopId}/item/${itemId}`)
    } catch (error) {
      console.log(error)
      return res.status(500).render("item", {
                error: error.toString(),
                title: "Item Error",
                themeType: themeType,
                loggedIn: req.session.user
            });
    }
  })

  router.route('/shop/:id/reviewSearch/:search').get(async (req, res) => {
    const shop = (xss(req.params.id)).trim();
    const search = (xss(req.params.search)).trim();
    const decodeSearch = xss(decodeURIComponent(search));
    const item = xss((xss(req.originalUrl)).split('?item=')[1]);
    const themeType = req.session.user && req.session.user.themeType ? req.session.user.themeType : 'light';
    if(!shop || (shop.trim().length === 0)){
      return res.status(400).render('error', {error: 'Must input shop id', themeType: themeType});
    } 
    try {
      let searchResult
      if(item){
        searchResult = await itemData.getItem(item);
      }
      else{
        searchResult = await shopData.getShop(shop);
      }
      if (!searchResult.name){
        return res.status(404).render('error',{error: `No shop with ID ${shop} found`, themeType: themeType});
      }
      const storeReviewsPromises = searchResult.reviews.map(async (review) => await reviewData.getReview(review.toString()));
      const storeReviews = await Promise.all(storeReviewsPromises);
      let filteredReviews = [];
      let highestReviews = [];
      let lowestReviews = [];
      let newestReviews = [];
      let alphaForward = [];
      let alphaBackward = [];
      if(decodeSearch.toLowerCase().substring(0,3) == "by:"){
        let userSearch = decodeSearch.substring(3);
        for(let review of storeReviews){
          if(review.user.toLowerCase() == userSearch.toLowerCase()){
            filteredReviews.push(review);
            highestReviews.push(review);
            lowestReviews.push(review);
            newestReviews.push(review);
            alphaBackward.push(review);
            alphaForward.push(review);
          }
        }
        highestReviews.sort(function(a,b){return  b.rating - a.rating});
        lowestReviews.sort(function(a,b){return  a.rating - b.rating});
        newestReviews.reverse();
        alphaForward.sort(function(a,b){return a.title.localeCompare(b.title)});
        alphaBackward.sort(function(a,b){return b.title.localeCompare(a.title)});
        res.render('reviewSearch', {title: "Review Search Results", shop:searchResult, reviews:filteredReviews, user:userSearch,
        highestReviews:highestReviews, lowestReviews:lowestReviews, newestReviews:newestReviews, alphaBackward:alphaBackward, alphaForward:alphaForward,
        loggedIn: req.session.user, themeType: themeType});
      } else {
        for(let review of storeReviews){
          if(review.review.toLowerCase().includes(decodeSearch.toLowerCase())){
            filteredReviews.push(review);
            highestReviews.push(review);
            lowestReviews.push(review);
            newestReviews.push(review);
            alphaBackward.push(review);
            alphaForward.push(review);
          }
        }
      highestReviews.sort(function(a,b){return  b.rating - a.rating});
      lowestReviews.sort(function(a,b){return  a.rating - b.rating});
      newestReviews.reverse();
      alphaForward.sort(function(a,b){return a.title.localeCompare(b.title)});
      alphaBackward.sort(function(a,b){return b.title.localeCompare(a.title)});
      res.render('reviewSearch', {title: "Review Search Results", shop:searchResult, reviews:filteredReviews, search:decodeSearch,
        highestReviews:highestReviews, lowestReviews:lowestReviews, newestReviews:newestReviews, alphaBackward:alphaBackward, alphaForward:alphaForward,
        loggedIn: req.session.user, themeType: themeType, item: item});
      }
    } catch(e){
      res.status(500).render('error',{error: e, loggedIn: req.session.user, themeType: themeType});
    }
  })

  router.route('/shop/:id/reviewSearch').get(async (req, res) => {
    const shop = (xss(req.params.id)).trim();
    const themeType = req.session.user && req.session.user.themeType ? req.session.user.themeType : 'light';
    if(!shop || (shop.trim().length === 0)){
      return res.status(400).render('error', {error: 'Must input shop id', themeType: themeType});
    } 
    try {
      const searchResult = await shopData.getShop(shop);
      if (!searchResult.name){
        return res.status(404).render('error',{error: `No shop with ID ${shop} found`, themeType: themeType});
      }
      const storeReviewsPromises = searchResult.reviews.map(async (review) => await reviewData.getReview(review.toString()));
      const storeReviews = await Promise.all(storeReviewsPromises);
      let filteredReviews = [];
      let highestReviews = [];
      let lowestReviews = [];
      let newestReviews = [];
      let alphaForward = [];
      let alphaBackward = [];
      for(let review of storeReviews){
          filteredReviews.push(review);
          highestReviews.push(review);
          lowestReviews.push(review);
          newestReviews.push(review);
          alphaForward.push(review);
          alphaBackward.push(review);
      }
      highestReviews.sort(function(a,b){return  b.rating - a.rating});
      lowestReviews.sort(function(a,b){return  a.rating - b.rating});
      newestReviews.reverse();
      alphaForward.sort(function(a,b){return a.title.localeCompare(b.title)});
      alphaBackward.sort(function(a,b){return b.title.localeCompare(a.title)});
      res.render('reviewSearch', {title: "Review Search Results", shop:searchResult, reviews:filteredReviews,
        highestReviews:highestReviews, lowestReviews:lowestReviews, newestReviews:newestReviews, alphaForward:alphaForward, alphaBackward:alphaBackward,
        loggedIn: req.session.user, themeType: themeType});
    } catch(e){
      res.status(500).render('error',{error: e, loggedIn: req.session.user, themeType: themeType});
    }
  })

  router.route('/shop/:id/itemSearch/:search').get(async (req, res) => {
    const shop = (xss(req.params.id)).trim();
    const search = (xss(req.params.search)).trim();
    const decodeSearch = decodeURIComponent(search);
    const themeType = req.session.user && req.session.user.themeType ? req.session.user.themeType : 'light';
    if(!shop || (shop.trim().length === 0)){
      return res.status(400).render('error', {error: 'Must input shop id', themeType: themeType});
    } 
    try {
      const searchResult = await shopData.getShop(shop);
      if (!searchResult.name){
        return res.status(404).render('error',{error: `No shop with ID ${shop} found`, themeType: themeType});
      }
      const storeItems = await searchResult.items;
      let filteredItems = [];
      for(let item of storeItems){
        if(item.description.toLowerCase().includes(decodeSearch.toLowerCase())){
          filteredItems.push(item);
        }
      }
      res.render('itemSearch', {title: "Item Search Results", shop:searchResult, items:filteredItems, search:decodeSearch,
        loggedIn: req.session.user, themeType: themeType});
    } catch(e){
      res.status(500).render('error',{error: e, loggedIn: req.session.user, themeType: themeType});
    }
  })

  router.route('/shop/:id/itemSearch').get(async (req, res) => {
    const shop = (xss(req.params.id)).trim();
    const themeType = req.session.user && req.session.user.themeType ? req.session.user.themeType : 'light';
    if(!shop || (shop.trim().length === 0)){
      return res.status(400).render('error', {error: 'Must input shop id', themeType: themeType});
    } 
    try {
      const searchResult = await shopData.getShop(shop);
      if (!searchResult.name){
        return res.status(404).render('error',{error: `No shop with ID ${shop} found`, themeType: themeType});
      }
      const storeItems = await searchResult.items;
      res.render('itemSearch', {title: "Item Search Results", shop:searchResult, items:storeItems,
        loggedIn: req.session.user, themeType: themeType});
    } catch(e){
      res.status(500).render('error',{error: e, loggedIn: req.session.user, themeType: themeType});
    }
  })

export default router;