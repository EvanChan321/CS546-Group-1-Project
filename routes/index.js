//Here you will import route files and export them as used in previous labs
import shopRoutes from './shops.js';

const constructorMethod = (app) => {
  app.use('/', shopRoutes);

  app.use('*', (req, res) => {
    return res.status(404).json({error: '404: Not Found'});
  });
};

export default constructorMethod;