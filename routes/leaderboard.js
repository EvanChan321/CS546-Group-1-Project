import { Router } from "express";
const router = Router();
import { leaderboardData } from "../data/index.js";

router
  .route('/')
  .get(async (req, res) => {
    const themeType = req.session.user && req.session.user.themeType ? req.session.user.themeType : 'light';
    try {
      const leaderboard = await leaderboardData.calculateLeaderBoard()
      return res.status(200).render('leaderboard', {title: "leaderboard", leaderboard: leaderboard, themeType: themeType});
    } catch (e) {
      return res.status(404).render('error',{error: e, themeType: themeType});
    }
  })


export default router;
