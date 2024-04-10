import {Router} from 'express';
import {shopData,itemData,reviewData} from '../data/index.js'
const router = Router();


//basic stuff to render home file can change to to a different route in the future this is just for rendering the home page
router.route('/').get(async (req, res) => {
  //code here for GET will render the home handlebars file
  try{
    res.render('home', {title: "Boba Panda"});
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

router.route('/shop/:id').get(async (req, res) => {
  const search = req.params.id;
  if(!search || (search.trim().length === 0)){
    return res.status(400).render('error', {error: 'Must input search id'});
  } 
  try {
    const searchResult = await shopData.getShop(search);
    if (!searchResult.Title){
      return res.status(404).render('error',{error: `No shop with ID ${search} found`});
    }
    const storeItems = searchResult.items.map((item) => itemData.getItem(item));
    const storeReviews = searchResult.reviews.map((review) => reviewData.getReview(review));
    res.render('shopPage', {shop:searchResult, items:storeItems, reviews:storeReviews});
  } catch(e){
    res.status(500).render('error',{error: e});
  }
});

router.route('/account').get(async (req, res) => {
  try{
    res.render('account');
  }catch(e){
    console.log(e);
  }
})

export default router;
