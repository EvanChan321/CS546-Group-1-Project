import {Router} from 'express';
import {shopData,itemData,reviewData, flagData, userData} from '../data/index.js'
import {intCheck, sortLev} from '../valid.js'
import * as valid from "../valid.js";
const router = Router();


//basic stuff to render home file can change to to a different route in the future this is just for rendering the home page
router.route('/').get(async (req, res) => {
  //code here for GET will render the home handlebars file
  try{
    res.render('home', {title: "Boba Fettch"});
  }catch(e){
    res.sendStatus(500);
  }
});

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
    res.render('addShop', { title: "Add Shop" });
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
    const sortShops = sortLev(shops,search);
    res.render('shopSearchResults', {shops: sortShops});
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
    console.log(searchResult)
    console.log(storeItems)
    console.log(storeReviews)
    res.render('shopPage', {shop:searchResult, items:storeItems, reviews:storeReviews});
  } catch(e){
    res.status(500).render('error',{error: e});
  }
})
.post(async (req, res) => {
  let userId //need from cookies
  let shopId
  try{
    userId = valid.idCheck(userId) //cookie eventually
    shopId = valid.idCheck(req.param.id)
  }catch(e){
    return res.status(400).render('shopPage', {
      error: e.toString(), 
    })    
  }
  try{
    const user = userData.getUser(userId)
    let updatedLike
    if(user.bookmarks.includes(shopId)){
      updatedLike = userData.likeShop(userId, shopId)
    }
    else{
      updatedLike  = userData.unlikeShop(userId, shopId)
    }
    return res.render('shopPage', updatedLike)
  }catch(e){
    return res.status(500).render('shopPage', {
      error: e.toString(), 
    })  
  }
})
.delete(async (req, res) => {
  let userPassword //verify if its an admin or the owner account 
  let userId
  let shopId
  try{
    userId //= valid.idCheck(req.params.userId)
    userPassword //= valid.passwordCheck(req.body.password)
    shopId = valid.idCheck(req.params.id)
  }
  catch(e){
    return res.status(400).render("shopPage", {
      error: e.toString(),
      title: "Shop",
      password: userPassword
    });
  }
  try {
    const info = await shopData.removeShop(shopId)
    //req.session.user = user;
    return res.redirect(`/shops`)
  } catch (error) {
    return res.status(500).render("shopPage", {
            error: error.toString(),
            title: "Shop",
            password: userPassword
          });
  }
})

router
  .route('/shop/:shopId/itemForm')
  .get(async (req, res) => {
    res.render("itemForm", {
      title: "Item Form"
    });
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
        tags: req.body.tags.trim(),
        allergens: req.body.allergens.trim()
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
      //req.session.user = user;
      return res.redirect(`/shop/${shopId}/${item._id}`)
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

router//need to add authentication with getting userId from cookies and making sure its the right user
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
      shopId = valid.idCheck(req.body.shopId)
      title = valid.stringValidate(req.body.title)
      rating = parseNum(req.body.rating)
      intCheck(rating)
      review = valid.stringValidate(req.body.review)
    }
    catch(e){
      return res.status(400).render("reviewForm", {
        error: e.toString(),
        titlePage: "Review Form",
        title: title,
        rating: flagReason,
        review: review
      });
    }
    try {
      const review = await reviewData.createReview(
        userId,
        shopId,
        title,
        rating,
        review
      )
      //req.session.user = user;
      return res.redirect(`/review/${review._id}`)
    } catch (error) {
      return res.status(500).render("reviewForm", {
              error: e.toString(),
              titlePage: "Review Form",
              title: title,
              rating: flagReason,
              review: review
            });
    }
  })

router//need to add authentication with getting userId from cookies and making sure its the right user
  .route('/shop/:shopId/flagForm')
  .get(async (req, res) => {
    res.render("flagForm", {
      title: "Flag Form"
    });
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
  })
  .delete(async (req, res) => {
    let shopId //verify if admin
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
  })
  .delete(async (req, res) => {
    let shopId //verify if admin
    let itemId
    let userId //implement: verify if admin or owner 
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

router.route('/account').get(async (req, res) => {
  try{
    res.render('account');
  }catch(e){
    console.log(e);
  }
})

export default router;
