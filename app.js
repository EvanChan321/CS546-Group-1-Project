//Here is where you'll set up your server as shown in lecture code
import express from 'express';
const app = express();
import session from 'express-session';
import configRoutes from './routes/index.js';
import exphbs from 'express-handlebars';
import { addShop, claimShop, deleteComment, deleteFlag, deleteReview, deleteShop, deleteUser, editReview, editShop, flagShop, itemForm, leaveComment, loginData, reviewItem, reviewShop, seeFlag, userLogin } from './middleware.js';


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
  name: "Group1WebApp",
  secret: "This is a secret.. shhh don't tell anyone",
  saveUninitialized: true,
  resave: false,
}))

app.use('/user', loginData());
app.use('/user', userLogin());
app.use('/user/:userId/delete', deleteUser());
app.use('/shop/addShop', addShop())
app.use('/shop/:id/delete', deleteShop())
app.use('/shop/:shopId/item/:itemId/delete', deleteShop())
app.use('/shop/:shopId/flag/:flagId/delete', deleteFlag())
app.use('/shop/:shopId/flag/:flagId', seeFlag())
app.use('/shop/:shopId/flags', deleteFlag())
app.use('/shop/:id/edit', editShop())
app.use('/shop/:shopId/reviewForm', reviewShop())
app.use('/shop/:shopId/flagForm', flagShop())
app.use('/shop/:shopId/itemForm', itemForm())
app.use('/shop/:shopId/item/:itemId', reviewItem())
app.use('/shop/:shopId/item/:itemId/edit', itemForm())
app.use('/shop/:shopId/item/:itemId/delete', itemForm())
app.use('/review/:reviewId', editReview())
app.use('/review/:reviewId/comments', leaveComment())
app.use('/review/:reviewId/delete', deleteReview())
app.use('/review/:reviewId/comment/:commentId/delete', deleteComment())
app.use('/shop/:id/user/claim', claimShop())
configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});
