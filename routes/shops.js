import {Router} from 'express';
import {shopData,itemData,reviewData, flagData, userData} from '../data/index.js'
import {intCheck, sortLev} from '../valid.js'
import * as valid from "../valid.js";
const router = Router();


//basic stuff to render home file can change to to a different route in the future this is just for rendering the home page
router.route('/').get(async (req, res) => {
  //code here for GET will render the home handlebars file
  try{
    res.render('home', {
      title: "Boba Fettch",
      loggedIn: req.session.user,
    });
  }catch(e){
    res.sendStatus(500);
  }
});

// router.get('/map', (req, res) => {
//   res.sendFile('map2.html', { root: './' });
// }); 
router.route('/map').get(async (req, res) => {
  try{
    res.render('map', {
      title: "Map"
    });
  }catch(e){
    console.log(e);
  }
})

router.route('/shops').get(async (req, res) => {
  try{
    const shops = await shopData.getAllShops();
    res.render('shopSearchResults', {shops: shops});
  }catch(e){
    console.log(e);
  }
})

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
    try{
      shopName = valid.stringValidate(req.body.shopName)
      address = valid.stringValidate(req.body.address)
      website = valid.urlCheck(req.body.website)
      phoneNumber = valid.phoneNumberCheck(req.body.phoneNumber)
      if(req.body.ownerId){
        ownerId = valid.idCheck(ownerId)
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
      //req.session.user = user;
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
    const search = req.body.shop;
    console.log(search);
    let sortShops = sortLev(shops,search);
    if(req.body.minRating && req.body.minLikes){
      sortShops = sortShops.filter((shop) => (shop.numOfLikes >= req.body.minLikes));
      if(req.body.minRating > 0){
        sortShops = sortShops.filter((shop) => ((shop.averageRating >= req.body.minRating) && (shop.averageRating != "No Ratings")));
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
    const bmShops = shops.filter((shop) => (req.session.user.bookmarks).includes(shop._id.toString()));
    res.render('bookmarks', {title:"Bookmarks", shops: bmShops, loggedIn: req.session.user});
  }catch(e){
    res.status(500).render('error', {error: e});
  }
})

router.route('/shop/:id').get(async (req, res) => {
  const search = req.params.id.trim();
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
      inBookmarks = (req.session.user.bookmarks).includes(search)
    }
    res.render('shopPage', {title: searchResult.name, shop:searchResult, items:storeItems, reviews:storeReviews, loggedIn: req.session.user, inBookmarks: inBookmarks});
  } catch(e){
    res.status(500).render('error',{error: e});
  }
})
.post(async (req, res) => {
  let userId //need from cookies
  let shopId
  try{
    userId = valid.idCheck(req.session.user.id) //cookie eventually
    shopId = valid.idCheck(req.params.id)
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
    shopId = valid.idCheck(req.params.id)
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
      const searchResult = await shopData.getShop(req.params.shopId); 
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
      res.status(500).render('error', {error: "Internal Server Error"});
    }
  })
  .post(async (req, res) => {
    let shopId
    let name
    let description
    let price
    let tags
    let allergens
    try{
      shopId = valid.idCheck(req.body.shopId)
      name = valid.stringValidate(req.body.name)
      description = valid.stringValidate(req.body.description)
      price = req.body.price
      price = parseNum(price)
      valid.numCheck(price)
      if(price < 1 || price > 5){
        throw 'invalid rating'
      }
      if(!Number.isInteger(price)){
        maxDecimal(price, 0)
      }
      tags = req.body.tags.trim()
      tags = valid.arrayOfStrings(tags.split(","))
      allergens = req.body.allergens.trim()
      allergens = valid.arrayOfStrings(allergens.split(","))
    }
    catch(e){
      return res.status(400).render("itemForm", {
        error: e.toString(),
        title: "Item Form",
        name: name,
        description: description,
        price: price,
        tags: req.body.tags,
        allergens: req.body.allergens
      });
    }
    try {
      const item = await itemData.createItem(
        name,
        description,
        price,
        tags,
        allergens
      )
      //return res.redirect(`/shop/${shopId}/${item._id}`)
      return res.redirect(`/shop/${shopId}`)
    } catch (error) {
      return res.status(500).render("addShop", {
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

router
  .route('/shop/:shopId/reviewForm')
  .get(async (req, res) => {
    res.render("reviewForm", {
      title: "Review Form"
    });
  })
  .post(async (req, res) => {
    let shopId
    let userId
    let title
    let rating
    let review
    try{
      userId = valid.idCheck(req.session.user.id);
      shopId = valid.idCheck(req.params.shopId);
      title = valid.stringValidate(req.body.title);
      rating = parseInt(req.body.rating);
      intCheck(rating);
      review = valid.stringValidate(req.body.review);
    }
    catch(e){
      console.log(e);
      res.status(504).redirect(`/shop/${req.params.shopId}`);
    }
    try {
      const rev = await reviewData.createReview(
        userId,
        shopId,
        title,
        rating,
        review
      )
      return res.redirect(`/review/${rev._id}`)
    } catch(e) {
      console.log(e);
      res.status(500).render('error', {error: "Internal Server Error"})
    }
  })

router
  .route('/shop/:shopId/flagForm')
  .get(async (req, res) => {
    res.render("flagForm", {title: "Flag Form", id: req.params.shopId});
  })
  .post(async (req, res) => {
    let shopId
    let userId
    let flagReason
    try{
      shopId = valid.idCheck(req.body.shopId)
      flagReason = valid.stringValidate(req.body.flagReason)
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
      //req.session.user = user;
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
      shopId = valid.idCheck(req.params.shopId)
      flagId = valid.idCheck(req.params.flagId)
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
      shopId = valid.idCheck(req.params.shopId)
      flagId = valid.idCheck(req.params.flagId)
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
      shopId = valid.idCheck(req.params.shopId)
      itemId = valid.idCheck(req.params.itemId)
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
      shopId = valid.idCheck(req.params.shopId)
      itemId = valid.idCheck(req.params.itemId)
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
      shopId = valid.idCheck(req.body.shopId)
      itemId = valid.idCheck(req.body.itemId)
      name = valid.stringValidate(req.body.name)
      description = valid.stringValidate(req.body.description)
      price = req.body.price
      price = parseNum(price)
      valid.numCheck(price)
      if(price < 1 || price > 5){
        throw 'invalid rating'
      }
      if(!Number.isInteger(price)){
        maxDecimal(price, 0)
      }
      tags = req.body.tags.trim()
      tags = valid.arrayOfStrings(tags.split(","))
      allergens = req.body.allergens.trim()
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
        tags: req.body.tags.trim(),
        allergens: req.body.allergens.trim()
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
