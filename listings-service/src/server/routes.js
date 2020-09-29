import { Listing } from '../db/models';

const setupRoutes = (app) => {
  app.get('/listings', async (req, res, next) => {
    try {
      const listings = await Listing.findAll();
      return res.json({ listings });
    } catch (err) {
      console.log('-----Error----', { err });
    }
  });
};

export default setupRoutes;
