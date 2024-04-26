//Here is where you'll set up your server as shown in lecture code
import express from 'express';
const app = express();
import session from 'express-session';
import configRoutes from './routes/index.js';
import exphbs from 'express-handlebars';
import { addShop, deleteComment, deleteFlag, deleteItem, deleteReview, deleteShop, editReview, flagShop, itemForm, loginData, reviewShop, userLogin } from './middleware.js';


const rewriteUnsupportedBrowserMethods = (req, res, next) => {
  // If the user posts to the server with a property called _method, rewrite the request's method
  // To be that method; so if they post _method=PUT you can now allow browsers to POST to a route that gets
  // rewritten in this middleware to a PUT route
  if (req.body && req.body._method) {
    req.method = req.body._method;
    delete req.body._method;
  }

  // let the next middleware run:
  next();
};

app.use('/public', express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(rewriteUnsupportedBrowserMethods);

app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(session({
  name: 'AuthenticationState',
  secret: 'some secret string!',
  resave: false,
  saveUninitialized: false
}))

app.use('/user', loginData());
app.use('/user', userLogin());
app.use('/shop/addShop', addShop())
app.use('/shop/:id/delete', deleteShop())
app.use('/shop/:shopId/item/:itemId/delete', deleteShop())
app.use('/shop/:shopId/flag/:flagId/delete', deleteFlag())
app.use('/shop/:shopId/reviewForm', reviewShop())
app.use('/shop/:shopId/flagForm', flagShop())
app.use('/shop/:shopId/itemForm', itemForm())
app.use('/shop/:shopId/item/:itemId/edit', itemForm())
app.use('/shop/:shopId/item/:itemId/delete', deleteItem())
app.use('/shop/:shopId/item/:itemId/delete', deleteItem())
app.use('/:reviewId', editReview())
app.use('/:reviewId/delete', deleteReview())
app.use('/:reviewId/comment/:commentId/delete', deleteComment())
configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});
