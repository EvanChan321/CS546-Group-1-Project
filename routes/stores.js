import {Router} from 'express';
const router = Router();


//basic stuff to render home file can change to to a different route in the future this is just for rendering the home page
router.route('/').get(async (req, res) => {
  //code here for GET will render the home handlebars file
  try{
    res.render('home', {title: "Home"});
  }catch(e){
    res.sendStatus(500);
  }
});

export default router;
