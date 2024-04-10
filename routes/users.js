import { Router } from "express";
const router = Router();
import * as valid from "../valid.js";
import { reviewData, userData } from "../data/index.js";

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
        return res.status(200).json(user);
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

  //eventually need to add authentication
router
  .route('/signup')
  .get(async (req, res) => {
    res.render("signup", {
      title: "User Signup",
    });
  })
  .post(async (req, res) => {
    let userName
    let userPassword
    let userEmail
    let userZipcode
    try{
      userName = valid.stringValidate(res.body.name)
      userPassword = valid.passwordCheck(res.body.password)
      userEmail = valid.emailCheck(userEmail)
      userZipcode = valid.stringValidate(userZipcode)
      valid.zipcodeCheck(userZipcode)
    }
    catch(e){
      return res.status(400).render("signup", {
        error: e.toString(),
        title: "Sign Up",
        username: userName,
        password: userPassword,
        email: userEmail,
        zipcodeCheck: userZipcode,
      });
    }
    try {
      const user = await userData.createUser(
        userName,
        userPassword,
        userEmail,
        userZipcode,
        "Default"
      )
      req.session.user = user;
      return res.redirect(`/user/${user._id}`)
    } catch (error) {
      return res.status(500).render("signup", {
              error: error.toString(),
              title: "Sign Up",
            });
    }
  })
export default router;
