import { Router } from "express";
const router = Router();
import * as valid from "../valid.js";
import { commentData } from "../data/index.js";

router
  .route('/:commentId')
  .get(async (req, res) => {
    let commentId
    try {
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
  });


export default router;