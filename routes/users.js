import { Router } from "express";
const router = Router();
import * as valid from "../valid.js";
import { commentData, reviewData, userData } from "../data/index.js";
import xss from "xss";

router
  .route('/signup')
  .get(async (req, res) => {
    res.render("signup", {
      title: "User Signup",
      postTo: "",
      type: "business",
      link: "/business",
      themeType: 'light',
      loggedIn: req.session.user
    });
  })
  .post(async (req, res) => {
    let userName
    let userPassword
    let userEmail
    let userAddress
    let themeType
    try{
      userName = valid.stringValidate(xss(req.body.username))
      userPassword = valid.passwordCheck(xss(req.body.password))
      if(req.body.password !== xss(req.body.passwordConf)){
        throw "passwords dont match"
      }
      userEmail = valid.emailCheck(xss(req.body.email))
      userAddress = valid.stringValidate(xss(req.body.zipcode))
      themeType = valid.stringValidate(xss(req.body.themeType))
    }
    catch(e){
      return res.status(400).render("signup", {
        error: e.toString(),
        title: "User Signup",
        username: userName,
        email: userEmail,
        address: userAddress,
        themeType: 'light',
        loggedIn: req.session.user
      });
    }
    try {
      const user = await userData.createUser(
        userName,
        userPassword,
        userEmail,
        userAddress,
        "Default",
        themeType
      )
      return res.redirect(`/user/login`)
    } catch (error) {
      return res.status(500).render("signup", {
              error: error.toString(),
              title: "User Signup",
              username: userName,
              email: userEmail,
              address: userAddress,
              themeType: 'light',
              loggedIn: req.session.user
            });
    }
  })

  router
  .route('/signup/business')
  .get(async (req, res) => {
    res.render("signup", {
      title: "Business Signup",
      postTo: "/business",
      type: "user",
      link: "",
      themeType: 'light',
      loggedIn: req.session.user
    });
  })
  .post(async (req, res) => {
    let userName
    let userPassword
    let userEmail
    let userAddress
    let themeType
    try{
      userName = valid.stringValidate(xss(req.body.username))
      userPassword = valid.passwordCheck(xss(req.body.password))
      userEmail = valid.emailCheck(xss(req.body.email))
      userAddress = valid.stringValidate(xss(req.body.zipcode))
      themeType = valid.stringValidate(xss(req.body.themeType))
      if(req.body.password !== xss(req.body.passwordConf)){
        throw "passwords dont match"
      }
    }
    catch(e){
      return res.status(400).render("signup", {
        error: e.toString(),
        title: "Business Signup",
        username: userName,
        email: userEmail,
        address: userAddress,
        themeType: 'light',
        loggedIn: req.session.user
      });
    }
    try {
      const user = await userData.createUser(
        userName,
        userPassword,
        userEmail,
        userAddress,
        "Business",
        themeType
      )
      return res.redirect(`/user/login`)
    } catch (error) {
      return res.status(500).render("signup", {
              error: error.toString(),
              title: "Business Signup",
              username: userName,
              email: userEmail,
              address: userAddress,
              themeType: 'light',
              loggedIn: req.session.user
            });
    }
  })

router
  .route('/login')
  .get(async (req, res) => {
    res.render("login", {title: "User Login", themeType: 'light', loggedIn: req.session.user});
  })
  .post(async (req, res) => {
    let userEmailOrUsername
    let userPassword
    let user
    try{
      userEmailOrUsername = valid.stringValidate(xss(req.body.emailOrUsername))
      userPassword = valid.stringValidate(xss(req.body.password))
    }catch(e){
      return res.status(400).render("login", {
        error: e.toString(),
        title: "User Login",
        emailOrUsername: userEmailOrUsername,
        themeType: 'light',
        loggedIn: req.session.user
      });
    }
    try{
      user = await userData.loginUser(userEmailOrUsername, userPassword)
      req.session.user= {
        id: user._id.toString(),
        name: user.name, 
        email: user.email,
        address: user.address,
        accountType: user.accountType,
        pfp: user.pfp,
        themeType: user.themeType,
        bookmarks: user.bookmarks
      }
      return res.redirect(`/user/${user._id.toString()}`)
    }catch(e){
     return res.status(400).render("login", {
        error: e.toString(),
        title: "User Login",
        emailOrUsername: userEmailOrUsername,
        themeType: 'light',
        loggedIn: req.session.user
      });
    }
  }) 

router
  .route('/logout')
  .post(async (req, res) => {
    if(req.session.user){
      delete req.session.user;
    }
    res.redirect('/user/login')
  }) 

router
  .route('/:userId')
  .get(async (req, res) => {
    let userId
    const themeType = req.session.user && req.session.user.themeType ? req.session.user.themeType : 'light';
    try {
        userId = valid.idCheck(xss(req.params.userId))
    } catch (e) {
        return res.status(400).json({error: e});
    }
    try {
      let Business = false
      let ownAccount = false
      let Admin = false
        const user = await userData.getUser(userId);
        if(req.session.user){
          if(req.session.user.accountType === "Business"){
            Business = true
          }
          else if(req.session.user.accountType === "Admin"){
            Admin = true
          }
          if(req.session.user.id === user._id.toString()){
            ownAccount=true
          }
        }
        return res.status(200).render('user', {user: user, title: "Profile", loggedIn: req.session.user, themeType: themeType, pfp: req.session.user.pfp, Business: Business, ownAccount: ownAccount, Admin: Admin});
    } catch (e) {
        return res.status(404).json({error: e});
    }
  })
  .post(async (req, res) => {
    let updateObject = {}
    let userId
    let user
    const themeType = req.session.user && req.session.user.themeType ? req.session.user.themeType : 'light';
    try{
      userId = valid.idCheck(xss(req.params.userId))
      user = await userData.getUser(userId);
      if(xss(req.body.bio)){
        updateObject.bio = valid.stringValidate(req.body.bio)
      }
      if(xss(req.body.oldPassword)){
        updateObject.oldPassword = valid.passwordCheck(xss(req.body.oldPassword))
      }
      else{
        throw 'need to input password to make changes'
      }
      if(xss(req.body.password)){
        updateObject.password = valid.passwordCheck(req.body.password)
      }
      if(xss(req.body.address)){
        updateObject.userAddress = valid.stringValidate(xss(req.body.address))
      }
      if(xss(req.body.themeType)){
        updateObject.themeType = valid.stringValidate(xss(req.body.themeType))
      }
      if(xss(req.body.pfp)){
        updateObject.pfp = valid.stringValidate(xss(req.body.pfp))
      }
    }
    catch(e){
      console.log(e)
      return res.status(400).render("user", {
        error: e.toString(),
        title: "Profile",
        user: user,
        themeType: themeType,
        loggedIn: req.session.user
      });
    }
    try {
      const user = await userData.updateUser(
        userId,
        updateObject
      )
      if(updateObject.address){
        req.session.user.address = user.address
      }
      if(updateObject.themeType){
        req.session.user.themeType = user.themeType
      }
      if(updateObject.pfp){
        req.session.user.pfp = user.pfp
      }
      return res.redirect(`/user/${user._id}`)
    } catch (error) {
      return res.status(500).render("user", {
              error: error.toString(),
              title: "Profile",
              user: user,
              themeType: themeType,
              loggedIn: req.session.user
            });
    }
  })

router
  .route('/:userId/reviews')
  .get(async (req, res) => {
    let userId
    try {
        userId = valid.idCheck(xss(req.params.userId))
    } catch (e) {
        return res.status(400).json({error: e});
    }
    try {
        const reviews = await reviewData.getAllReviewsFromUser(userId);
        return res.status(200).json(reviews);
    } catch (e) {
        return res.status(404).json({error: e});
    }
  });


router
  .route('/:userId/delete')
  .post(async (req, res) => {
    let userId
    const themeType = req.session.user && req.session.user.themeType ? req.session.user.themeType : 'light';
    try{
      userId = valid.idCheck(xss(req.params.userId))
    }
    catch(e){
      return res.status(400).render("user", {
        error: e.toString(),
        title: "Profile",
        themeType: themeType,
        loggedIn: req.session.user
      });
    }
    try {
      const user = await userData.removeUser(userId)
      delete req.session.user;
      return res.redirect(`/`)
    } catch (error) {
      console.log(error)
      return res.status(500).render("user", {
        error: error.toString(),
        title: "Profile",
        themeType: themeType,
        loggedIn: req.session.user
      });
    }
  })

export default router;