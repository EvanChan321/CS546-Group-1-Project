import { Router } from "express";
const router = Router();
import * as valid from "../valid.js";
import { commentData, reviewData } from "../data/index.js";
import xss from "xss";

router
  .route('/:reviewId')
  .get(async (req, res) => {
    let reviewId
    try {
        reviewId = valid.idCheck(xss(req.params.reviewId))
    } catch (e) {
        return res.status(400).json({error: e});
    }
    try {
        const review = await reviewData.getReview(reviewId);
        return res.status(200).render('reviewPage', {title: `Review: ${review.title}`, loggedIn: req.session.user, review: review});
    } catch (e) {
        return res.status(404).render('error',{error: e});
    }
  })
  .post(async (req, res) => {
    let userId 
    let title
    let rating
    let review
    let edited
    let reviewId
    try{
      reviewId = valid.idCheck(xss(req.params.reviewId))
      userId = valid.idCheck(xss(req.session.user.id))
      title = valid.stringValidate(xss(req.body.title))
      rating = parseNum(xss(req.body.rating))
      intCheck(rating)
      review = valid.stringValidate(xss(req.body.review))
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
  });
router
  .route('/:reviewId/comments')
  .get(async (req, res) => {
    let reviewId
    try {
        reviewId = valid.idCheck(xss(req.params.reviewId))
    } catch (e) {
        return res.status(400).json({error: e});
    }
    try {
        const comments = await commentData.getAllCommentsFromReview(reviewId).map((comment) => commentData.getComment(comment));
        return res.status(200).render('commentsPage',{comments: comments});
    } catch (e) {
        return res.status(404).render('error',{error: e});
    }
  })
  .post(async (req, res) => { 
    let reviewId
    let userId
    let comment
    try{
      reviewId = valid.idCheck(xss(req.params.reviewId))
      userId = valid.idCheck(xss(req.session.user.id))
      comment = valid.stringValidate(xss(req.body.comment))
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
        reviewId = valid.idCheck(xss(req.params.reviewId))
        commentId = valid.idCheck(xss(req.params.commentId))
    } catch (e) {
        return res.status(400).json({error: e});
    }
    try {
        const comment = await commentData.getComment(commentId);
        return res.status(200).json(comment);
    } catch (e) {
        return res.status(404).json({error: e});
    }
  });
export default router;

router
  .route('/:reviewId/delete')
  .post(async (req, res) => {
  let reviewId
  try{
    reviewId = valid.idCheck(xss(req.params.reviewId))
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
  .route('/:reviewId/comment/:commentId/delete')
  .post(async (req, res) => {
  let reviewId 
  let commentId
  try{
    reviewId = valid.idCheck(xss(req.params.reviewId))
    commentId = valid.idCheck(xss(req.params.commentId))
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