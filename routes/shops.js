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
      title: "Boba Fettch",
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
    res.render('map', {
        title: "Map",
        lat: address.lat,
        long: address.lng,
        shops: JSON.stringify(pins),
        keys: process.env.GOOGLE_MAPS_KEY,
        themeType: themeType,
        loggedIn: req.session.user
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
    const themeType = req.session.user && req.session.user.themeType ? req.session.user.themeType : 'light';
    try{
      shopName = valid.stringValidate(xss(req.body.shopName))
      address = valid.stringValidate(xss(req.body.address))
      website = valid.urlCheck(xss(req.body.website))
      phoneNumber = valid.phoneNumberCheck(xss(req.body.phoneNumber))
      userId = valid.idCheck(xss(req.session.user.id))
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
    console.log(search);
    let sortShops = sortLev(shops,search);
    if(minRating && minLikes){
      sortShops = sortShops.filter((shop) => (shop.numOfLikes >= minLikes));
      if(req.body.minRating > 0){
        sortShops = sortShops.filter((shop) => ((shop.averageRating >= minRating) && (shop.averageRating != "No Ratings")));
      }
    }
    res.render('shopSearchResults', {title:"Search Results", shops: sortShops, loggedIn: req.session.user, search: search, themeType: themeType, currentHour: currentHour, currentMin: currentMin});
  }catch(e){
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
    console.log(req.session.user.bookmarks);
    console.log(shops[0]._id.toString());
    const bmShops = shops.filter((shop) => (xss(req.session.user.bookmarks)).includes(shop._id.toString()));
    res.render('bookmarks', {title:"Bookmarks", shops: bmShops, loggedIn: req.session.user, themeType: themeType, currentHour: currentHour, currentMin: currentMin});
  }catch(e){
    res.status(500).render('error', {title: "Bookmarks", error: e, themeType: themeType, loggedIn: req.session.user});
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
    if(searchResult.flags.length >= 10){
      flagged = true 
    }
    let Default = false
    let noOwner = false
    let isOwner = false
    let Admin = false
    if(req.session.user){
      if(req.session.user.accountType === "Default"){
        Default = true
      }
      if(req.session.user.accountType === "Admin"){
        Admin = true
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
    res.render('shopPage', {title: searchResult.name, shop:searchResult, items:storeItems, reviews:storeReviews, 
      loggedIn: req.session.user, inBookmarks: inBookmarks, flagged: flagged, Default: Default, isOwner: isOwner, 
      noOwner: noOwner, themeType: themeType, currentHour: currentHour, currentMin: currentMinute, Admin: Admin});
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
    let shopId, name, description, price, tags, allergens, userId
    const themeType = req.session.user && req.session.user.themeType ? req.session.user.themeType : 'light';
    try{
      shopId = valid.idCheck(xss(req.params.shopId))
      name = valid.stringValidate(xss(req.body.name), "name")
      description = valid.stringValidate(xss(req.body.description), "description")
      price = xss(req.body.price)
      price = parseFloat(price)
      valid.checkPrice(price)
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
      console.log(price);
      console.log(name);
      console.log(description);
      console.log(allergens);
      console.log(tags);
      const item = await itemData.createItem(
        shopId,
        name,
        description,
        price,
        tags,
        allergens
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
      console.log(updatedUser)
      return res.redirect(`/review/${rev._id}`)
    } catch(e) {
      console.log("fsadlfjaoifnoiashpodfi");
      res.status(500).render('error', {title: "Review Form", error: "Internal Server Error", loggedIn: req.session.user, themeType: themeType})
    }
  })

router
  .route('/shop/:shopId/flagForm')
  .get(async (req, res) => {
    const themeType = req.session.user && req.session.user.themeType ? req.session.user.themeType : 'light';
    res.render("flagForm", {title: "Flag Form", id: xss(req.params.shopId), loggedIn: req.session.user, themeType: themeType});
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
      if(req.session.user){
        if(req.session.user.accountType === "Default"){
          Default = true
        }
      }
      return res.status(200).render("item", {
        title: item.name,
        item: item,
        shop: shop,
        loggedIn: req.session.user,
        themeType: themeType,
        Default: Default
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
  
router.route('/shop/:shopid/:itemId/edit')
  .get(async (req, res) => {
    const themeType = req.session.user && req.session.user.themeType ? req.session.user.themeType : 'light';
    res.render("itemEdit", {
      title: "Item Edit",
      themeType: themeType,
      loggedIn: req.session.user
    });
  })
  .post(async (req, res) => {
    let shopId
    let name
    let description
    let price
    let tags
    let allergens
    let updateItem
    const themeType = req.session.user && req.session.user.themeType ? req.session.user.themeType : 'light';
    try{
      shopId = valid.idCheck(xss(req.params.shopId))
      itemId = valid.idCheck(xss(req.params.itemId))
      name = valid.stringValidate(xss(req.body.name))
      description = valid.stringValidate(xss(req.body.description))
      price = xss(req.body.price)
      price = parseNum(price)
      valid.numCheck(price)
      if(price < 1 || price > 5){
        throw 'invalid rating'
      }
      if(!Number.isInteger(price)){
        maxDecimal(price, 0)
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
        allergens
      }
    }
    catch(e){
      return res.status(400).render("itemEdit", {
        error: e.toString(),
        title: "Item Edit",
        name: name,
        description: description,
        price: price,
        tags: tags,
        allergens: allergens,
        themeType: themeType,
        loggedIn: req.session.user
      });
    }
    try {
      const item = await itemData.updateItem(
        itemId,
        updateItem
      )
      return res.redirect(`/shop/${shopId}/${item._id}`)
    } catch (error) {
      return res.status(500).render("itemEdit", {
                error: error.toString(),
                title: "Add Shop",
                name: name,
                description: address,
                price: website,
                tags: phoneNumber,
                allergens: ownerId,
                themeType: themeType,
                loggedIn: req.session.user
            });
    }
  })

export default router;