import { Router } from "express";
const router = Router();
import { leaderboardData } from "../data/index.js";

router
  .route('/')
  .get(async (req, res) => {
    try {
      const leaderboard = await leaderboardData.calculateLeaderBoard()
      console.log(leaderboard)
      return res.status(200).render('leaderboard', {title: "leaderboard", leaderboard: leaderboard});
    } catch (e) {
      return res.status(404).render('error',{error: e});
    }
  })


export default router;
