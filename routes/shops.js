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
    res.render('home', {
      title: "Boba Fettch",
      loggedIn: req.session.user,
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
    res.render('map', {
      title: "Map",
      lat: cord.lat,
      long: cord.lng,
      shops: JSON.stringify(pins),
      keys: process.env.GOOGLE_MAPS_KEY
    });
  } catch (e) {
    console.log(e);
    res.status(500).send("Internal Server Error");
  }
})
.post(async (req, res) => {
  let address
  let pins
  try{
    address = valid.stringValidate(xss(req.body.address))
    address = await valid.getLatLong(address);   
    pins = await valid.getPins()
  }
  catch(e){
    return res.status(400).render("Map", {
      error: e.toString(),
      title: "Map",
    });
  }
  try{
    res.render('map', {
        title: "Map",
        lat: address.lat,
        long: address.lng,
        shops: JSON.stringify(pins),
        keys: process.env.GOOGLE_MAPS_KEY
      });
    } catch (e) {
        console.log(e);
        res.status(500).send("Internal Server Error");
    }
});


router.route('/shops').get(async (req, res) => {
  try{
    const shops = await shopData.getAllShops();
    res.render('shopSearchResults', {shops: shops});
  }catch(e){
    console.log(e);
  }
});

router
  .route('/shop/addShop')
  .get(async (req, res) => {
    res.render('addShop', {title: "Add Shop", loggedIn: req.session.user});
  })
  .post(async (req, res) => {
    let ownerId
    let shopName
    let address
    let website
    let phoneNumber
    let userId
    try{
      shopName = valid.stringValidate(xss(req.body.shopName))
      address = valid.stringValidate(xss(req.body.address))
      website = valid.urlCheck(xss(req.body.website))
      phoneNumber = valid.phoneNumberCheck(xss(req.body.phoneNumber))
      userId = valid.idCheck(xss(req.session.user.id))
      if(req.body.ownerId){
        ownerId = valid.idCheck(xss(req.body.ownerId))
      }
    }
    catch(e){
      return res.status(400).render("addShop", {
        error: e.toString(),
        title: "Add Shop",
        name: shopName,
        address: address,
        website: website,
        phoneNumber: phoneNumber,
        ownerId: ownerId
      });
    }
    try {
      const shop = await shopData.createShop(
        shopName,
        address,
        website,
        phoneNumber,
        ownerId
      )
      const updatedUser = await userData.updatePoints(userId, 50)
      return res.redirect(`/shop/${shop._id}`)
    } catch (error) {
      return res.status(500).render("addShop", {
              error: error.toString(),
              title: "Add Shop",
              name: shopName,
              address: address,
              website: website,
              phoneNumber: phoneNumber,
              ownerId: ownerId
            });
    }
  })

router.route('/shops/search').post(async (req, res) => {
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
    res.render('shopSearchResults', {title:"Search Results", shops: sortShops, loggedIn: req.session.user, search: search});
  }catch(e){
    res.status(500).render('error', {error: e});
  }
})

router.route('/shops/bookmarks').get(async (req,res) => {
  try{
    const shops = await shopData.getAllShops();
    console.log(req.session.user.bookmarks);
    console.log(shops[0]._id.toString());
    const bmShops = shops.filter((shop) => (xss(req.session.user.bookmarks)).includes(shop._id.toString()));
    res.render('bookmarks', {title:"Bookmarks", shops: bmShops, loggedIn: req.session.user});
  }catch(e){
    res.status(500).render('error', {error: e});
  }
})

router.route('/shop/:id').get(async (req, res) => {
  const search = (xss(req.params.id)).trim();
  if(!search || (search.trim().length === 0)){
    return res.status(400).render('error', {error: 'Must input search id'});
  } 
  try {
    const searchResult = await shopData.getShop(search);
    if (!searchResult.name){
      return res.status(404).render('error',{error: `No shop with ID ${search} found`});
    }
    const storeItemsPromises = searchResult.items.map(async (item) => await itemData.getItem(item.toString()));
    const storeReviewsPromises = searchResult.reviews.map(async (review) => await reviewData.getReview(review.toString()));
    const storeItems = await Promise.all(storeItemsPromises);
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
    if(req.session.user){
      if(req.session.user.accountType === "Default"){
        Default = true
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
      noOwner: noOwner});
  } catch(e){
    res.status(500).render('error',{error: e, loggedIn: req.session.user});
  }
})
.post(async (req, res) => {
  let userId 
  let shopId
  try{
    userId = valid.idCheck(xss(req.session.user.id)) 
    shopId = valid.idCheck(xss(req.params.id))
  }catch(e){
    return res.status(400).render('shopPage', {
      error: e.toString(), 
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
      error: e.toString(), 
    })  
  }
});

router.route('/shop/:id/delete')
.post(async (req, res) => {
  let shopId
  try{
    shopId = valid.idCheck(xss(req.params.id))
  }
  catch(e){
    return res.status(400).render("shopPage", {
      error: e.toString(),
      title: "Shop",
    });
  }
  try {
    const info = await shopData.removeShop(shopId)
    return res.redirect(`/shops`)
  } catch (error) {
    return res.status(500).render("shopPage", {
            error: error.toString(),
            title: "Shop",
          });
  }
})

router
  .route('/shop/:shopId/itemForm')
  .get(async (req, res) => {
    try{
      const searchResult = await shopData.getShop(xss(req.params.shopId)); 
      if (!searchResult.name){
        throw 'lebron james'
      }
      res.render("itemForm", {
        title: "Item Form",
        shop: searchResult,
        loggedIn: req.session.user
      });
    }catch(e){
      console.log(e);
      res.status(500).render('error', {error: "Internal Server Error", loggedIn: req.session.user});
    }
  })
  .post(async (req, res) => {
    let shopId, name, description, price, tags, allergens, userId
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
      return res.status(400).render('error', {error: e});
    }
    try {
      console.log(tags);
      console.log(price);
      console.log(name);
      console.log(description);
      console.log(allergens);
      const item = await itemData.createItem(
        name,
        description,
        price,
        tags,
        allergens
      )
      const updatedUser = await userData.updatePoints(userId, 20)
      return res.redirect(`/shop/${shopId}`)
    } catch (error) {
      console.log(error);
      return res.status(500).render('error', {error: "Internal Server Error"});
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
        review
      )
      const updatedUser = await userData.updatePoints(userId, 10)
      console.log(updatedUser)
      return res.redirect(`/review/${rev._id}`)
    } catch(e) {
      console.log("fsadlfjaoifnoiashpodfi");
      res.status(500).render('error', {error: "Internal Server Error", loggedIn: req.session.user})
    }
  })

router
  .route('/shop/:shopId/flagForm')
  .get(async (req, res) => {
    res.render("flagForm", {title: "Flag Form", id: xss(req.params.shopId), loggedIn: req.session.user});
  })
  .post(async (req, res) => {
    let shopId
    let userId
    let flagReason
    try{
      userId = valid.idCheck(xss(req.session.user.id))
      shopId = valid.idCheck(xss(req.params.shopId))
      flagReason = valid.stringValidate(xss(req.body.description))
    }
    catch(e){
      return res.status(400).render("flagForm", {
        error: e.toString(),
        title: "Flag Form",
        flagReason: flagReason
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
              flagReason: flagReason
            });
    }
  })

router
  .route('/shop/:shopId/flag/:flagId')
  .get(async (req, res) => {
    let shopId
    let flagId
    try {
      shopId = valid.idCheck(xss(req.params.shopId))
      flagId = valid.idCheck(xss(req.params.flagId))
    } catch (e) {
      return res.status(400).json({error: e});
    }
    try {
      const flag = await flagData.getFlag(flagId);
      return res.status(200).json(flag);
    } catch (e) {
      return res.status(404).json({error: e});
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
    let shopId
    let itemId
    try {
      shopId = valid.idCheck(xss(req.params.shopId))
      itemId = valid.idCheck(xss(req.params.itemId))
    } catch (e) {
      return res.status(400).json({error: e});
    }
    try {
      const item = await itemData.getItem(itemId);
      return res.status(200).json(item);
    } catch (e) {
      return res.status(404).json({error: e});
    }
  });

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
    res.render("itemEdit", {
      title: "Item Edit"
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
      });
    }
    try {
      const item = await itemData.updateItem(
        itemId,
        updateItem
      )
      //req.session.user = user;
      return res.redirect(`/shop/${shopId}/${item._id}`)
    } catch (error) {
      return res.status(500).render("itemEdit", {
                error: error.toString(),
                title: "Add Shop",
                name: name,
                description: address,
                price: website,
                tags: phoneNumber,
                allergens: ownerId
            });
    }
  })

export default router;
