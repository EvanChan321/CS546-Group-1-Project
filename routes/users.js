import { Router } from "express";
const router = Router();
import * as valid from "../valid.js";
import { commentData, reviewData, userData } from "../data/index.js";

router
  .route('/signup')
  .get(async (req, res) => {
    res.render("signup", {
      title: "User Signup",
      postTo: "",
      type: "business",
      link: "/business"
    });
  })
  .post(async (req, res) => {
    let userName
    let userPassword
    let userEmail
    let userAddress
    try{
      userName = valid.stringValidate(req.body.username)
      userPassword = valid.passwordCheck(req.body.password)
      userEmail = valid.emailCheck(req.body.email)
      userAddress = valid.stringValidate(req.body.zipcode)
    }
    catch(e){
      return res.status(400).render("signup", {
        error: e.toString(),
        title: "User Signup",
        username: userName,
        password: userPassword,
        email: userEmail,
        address: userAddress
      });
    }
    try {
      const user = await userData.createUser(
        userName,
        userPassword,
        userEmail,
        userAddress,
        "Default"
      )
      //req.session.user = user;
      return res.redirect(`/user/${user._id}`)
    } catch (error) {
      return res.status(500).render("signup", {
              error: error.toString(),
              title: "User Signup",
              username: userName,
              password: userPassword,
              email: userEmail,
              address: userAddress
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
      link: ""
    });
  })
  .post(async (req, res) => {
    let userName
    let userPassword
    let userEmail
    let userAddress
    try{
      userName = valid.stringValidate(req.body.username)
      userPassword = valid.passwordCheck(req.body.password)
      userEmail = valid.emailCheck(req.body.email)
      userAddress = valid.stringValidate(req.body.zipcode)
    }
    catch(e){
      return res.status(400).render("signup", {
        error: e.toString(),
        title: "Business Signup",
        username: userName,
        password: userPassword,
        email: userEmail,
        address: userAddress
      });
    }
    try {
      const user = await userData.createUser(
        userName,
        userPassword,
        userEmail,
        userAddress,
        "Business"
      )
      //req.session.user = user;
      return res.redirect(`/user/${user._id}`)
    } catch (error) {
      return res.status(500).render("signup", {
              error: error.toString(),
              title: "Business Signup",
              username: userName,
              password: userPassword,
              email: userEmail,
              address: userAddress
            });
    }
  })

router
  .route('/login')
  .get(async (req, res) => {
    res.render("login", {title: "User Login"});
  })
  .post(async (req, res) => {
    console.log(req.body)
    let userEmailOrUsername
    let userPassword
    let user
    try{
      userEmailOrUsername = valid.stringValidate(req.body.emailOrUsername)
      userPassword = valid.stringValidate(req.body.password)
    }catch(e){
      return res.status(400).render("login", {
        error: e.toString(),
        title: "User Login",
        emailOrUsername: userEmailOrUsername,
      });
    }
    try{
      user = await userData.loginUser(userEmailOrUsername, userPassword)
      //req.session.user = user;
      return res.redirect(`/user/${user._id.toString()}`)
    }catch(e){
     return res.status(400).render("login", {
        error: e.toString(),
        title: "User Login",
        emailOrUsername: userEmailOrUsername,
      });
    }
  }) 

router
  .route('/:userId')
  .get(async (req, res) => {
    let userId
    try {
        userId = valid.idCheck(req.params.userId)
    } catch (e) {
        return res.status(400).json({error: e});
    }
    try {
        const user = await userData.getUser(userId);
        return res.status(200).render('user', {user: user, title: "Profile"});
    } catch (e) {
        return res.status(404).json({error: e});
    }
  });

router
  .route('/:userId/reviews')
  .get(async (req, res) => {
    let userId
    try {
        userId = valid.idCheck(req.params.userId)
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
  .route('/:userId/edit')
  .get(async (req, res) => {
    res.render("userEdit", {
      title: "User Edit"
    });
  })
  .post(async (req, res) => {
    let userName
    let userPassword
    let userBio
    let userAddress
    let updateObject
    let userId
    try{
      userId = valid.idCheck(req.params.userId)
      userName = valid.stringValidate(req.body.username)
      userBio = valid.stringValidate(req.body.bio)
      userPassword = valid.passwordCheck(req.body.password)
      userOldPassword = valid.passwordCheck(req.body.oldPassword)
      userAddress = valid.stringValidate(req.body.address)
      updateObject = {
        name: userName,
        password: userPassword,
        oldPassword: userOldPassword,
        bio: userBio,
        address: userAddress
      }
    }
    catch(e){
      return res.status(400).render("userEdit", {
        error: e.toString(),
        title: "User Edit",
        username: userName,
        password: userPassword,
        oldPassword: userOldPassword,
        bio: userBio,
        address: userAddress
      });
    }
    try {
      const user = await userData.updateUser(
        userId,
        updateObject
      )
      //req.session.user = user;
      return res.redirect(`/user/${user._id}`)
    } catch (error) {
      return res.status(500).render("userEdit", {
              error: error.toString(),
              title: "User Edit",
              username: userName,
              password: userPassword,
              oldPassword: userOldPassword,
              bio: userBio,
              address: userAddress
            });
    }
  })

router
  .route('/:userId/delete')
  .get(async (req, res) => {
    res.render("userDelete", {
      title: "User Delete"
    });
  })
  .delete(async (req, res) => {
    let userPassword
    let userId
    try{
      userId = valid.idCheck(req.params.userId)
      userPassword = valid.passwordCheck(req.body.password)
    }
    catch(e){
      return res.status(400).render("userDelete", {
        error: e.toString(),
        title: "User Delete",
        password: userPassword
      });
    }
    try {
      const user = await userData.removeUser(userId)
      //req.session.user = user;
      return res.redirect(`/`)
    } catch (error) {
      return res.status(500).render("userDelete", {
              error: error.toString(),
              title: "User Delete",
              password: userPassword
            });
    }
  })
  //eventually need to add authentication
export default router;
