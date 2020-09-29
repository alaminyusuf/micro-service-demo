const setupRoutes = (app) => {
  app.get('/listings', (req, res, next) => {
    res.json({ message: 'yeehaw' });
  });
};

export default setupRoutes;
