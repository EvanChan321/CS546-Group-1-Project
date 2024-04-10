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

export default router;
