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
        return res.status(200).render('reviewPage',{review: review});
    } catch (e) {
        return res.status(404).render('error',{error: e});
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
        const comments = await commentData.getAllCommentsFromReview(reviewId).map((comment) => commentData.getComment(comment));
        return res.status(200).render('commentsPage',{comments: comments});
    } catch (e) {
        return res.status(404).render('error',{error: e});
    }
  });


export default router;