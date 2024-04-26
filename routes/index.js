//Here you will import route files and export them as used in previous labs
import shopRoutes from './shops.js';
import userRoutes from './users.js';
import reviewRoutes from './reviews.js'
import leaderboardRoutes from './leaderboard.js'

const constructorMethod = (app) => {
  app.use('/', shopRoutes)
  app.use("/user", userRoutes)
  app.use("/review", reviewRoutes)
  app.use("/leaderboard", leaderboardRoutes)
  app.use('*', (req, res) => {
    return res.status(404).render('error', {error: '404: Not Found'})
  });
};

export default constructorMethod;