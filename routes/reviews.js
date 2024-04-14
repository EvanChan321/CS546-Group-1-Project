import { Router } from "express";
const router = Router();
import * as valid from "../valid.js";
import { commentData, reviewData } from "../data/index.js";

router
  .route('/:reviewId')
  .get(async (req, res) => {
    let reviewId
    try {
        reviewId = valid.idCheck(req.params.reviewId)
    } catch (e) {
        return res.status(400).json({error: e});
    }
    try {
        const review = await reviewData.getReview(reviewId);
        return res.status(200).json(review);
    } catch (e) {
        return res.status(404).json({error: e});
    }
  })
  .post(async (req, res) => { 
    //implement
  })
  .delete(async (req, res) => {
    let reviewId
    try{
      reviewId = valid.idCheck(req.params.reviewId)
    }
    catch(e){
      return res.status(400).render("review", {
        error: e.toString(),
        title: "Review"
      });
    }
    try {
      const user = await reviewData.removeReview(reviewId)
      //req.session.user = user;
      return res.redirect(`/user/${user._id}`)
    } catch (error) {
      return res.status(500).render("review", {
              error: error.toString(),
              title: "Rseview"
            });
    }
  });

router
  .route('/:reviewId/comments')
  .get(async (req, res) => {
    let reviewId
    try {
        reviewId = valid.idCheck(req.params.reviewId)
    } catch (e) {
        return res.status(400).json({error: e});
    }
    try {
        const comments = await commentData.getAllCommentsFromReview(reviewId);
        return res.status(200).json(comments);
    } catch (e) {
        return res.status(404).json({error: e});
    }
  });


export default router;