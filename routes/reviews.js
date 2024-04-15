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
    let userId //need to verify it is the user
    let title
    let rating
    let review
    let edited
    let reviewId
    try{
      reviewId = valid.idCheck(req.params.reviewId)
      userId
      title = valid.stringValidate(req.body.title)
      rating = parseNum(req.body.rating)
      intCheck(rating)
      review = valid.stringValidate(req.body.review)
      edited = true
    }
    catch(e){
      return res.status(400).render("review", {
        error: e.toString(),
        titlePage: "Review",
        title: title,
        rating: flagReason,
        review: review
      });
    }
    try {
      let updateObject = {
        title: title,
        rating: rating,
        review: review,
        edited: edited
      }
      const review = await reviewData.updateReview(
        reviewId,
        updateObject
      )
      return res.redirect(`/review/${review._id}`)
    } catch (error) {
      return res.status(500).render("review", {
              error: e.toString(),
              titlePage: "Review",
              title: title,
              rating: flagReason,
              review: review
            });
    }
  })
  .delete(async (req, res) => {
    let reviewId //need to eventually verify if user that made it or an admin
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
      return res.redirect(`/user/${user._id}`)
    } catch (error) {
      return res.status(500).render("review", {
              error: error.toString(),
              title: "Review"
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
  })
  .post(async (req, res) => { 
    let reviewId
    let userId
    let comment
    try{
      reviewId = valid.idCheck(req.params.reviewId)
      userId //implement 
      comment = valid.stringValidate(req.body.comment)
    }
    catch(e){
      return res.status(400).render("review", {
        error: e.toString(),
        title: "Review",
        comment: comment
      });
    }
    try{
      const comment = await commentData.createComment(userId, reviewId, comment)
      return res.redirect(`/${reviewId}/comments`)
    }
    catch(e){
      return res.status(400).render("review", {
        error: e.toString(),
        title: "Review",
        comment: comment
      });
    }
  })

router
  .route('/:reviewId/comment/:commentId')
  .get(async (req, res) => {
    let reviewId
    try {
        reviewId = valid.idCheck(req.params.reviewId)
        commentId = valid.idCheck(req.params.commentId)
    } catch (e) {
        return res.status(400).json({error: e});
    }
    try {
        const comment = await commentData.getComment(commentId);
        return res.status(200).json(comment);
    } catch (e) {
        return res.status(404).json({error: e});
    }
  })
  .delete(async (req, res) => {
    let reviewId //verify if admin
    let commentId
    try{
      reviewId = valid.idCheck(req.params.reviewId)
      commentId = valid.idCheck(req.params.commentId)
    }
    catch(e){
      return res.status(400).json({error: e});
    }
    try {
      const comment = await commentData.removeComment(commentId)
      return res.redirect(`/${reviewId}/comments`)
    } catch (error) {
      return res.status(500).json({error: e});
    }
  });

export default router;