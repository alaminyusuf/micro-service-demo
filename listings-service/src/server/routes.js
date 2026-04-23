import { Listing } from '../db/models';
import logger from '../helpers/logger';

/**
 * Sets up listing-related routes for the application.
 * @param {import('express').Express} app - The Express application instance.
 */
const setupRoutes = (app) => {
  /**
   * @api {get} /listings Get all listings
   * @apiName GetListings
   * @apiGroup Listing
   */
  app.get('/listings', async (req, res) => {
    const listings = await Listing.findAll();
    return res.json({ listings });
  });

  /**
   * @api {post} /listings Create a new listing
   * @apiName CreateListing
   * @apiGroup Listing
   */
  app.post('/listings', async (req, res) => {
    const { title, description } = req.body;

    if (!title || !description) {
      const error = new Error('Title and description are required!');
      error.status = 400;
      throw error;
    }

    const newListing = await Listing.create({
      title,
      description,
    });

    logger.info(`Listing created: ${newListing.id}`);
    return res.status(201).json(newListing);
  });

  /**
   * @api {get} /listings/:listingId Get listing by ID
   * @apiName GetListing
   * @apiGroup Listing
   */
  app.get('/listings/:listingId', async (req, res) => {
    const listing = await Listing.findByPk(req.params.listingId);

    if (!listing) {
      const error = new Error('Listing not found');
      error.status = 404;
      throw error;
    }

    return res.json(listing);
  });

  /**
   * @api {put} /listings/:listingId Update listing
   * @apiName UpdateListing
   * @apiGroup Listing
   */
  app.put('/listings/:listingId', async (req, res) => {
    const { title, description } = req.body;
    const listing = await Listing.findByPk(req.params.listingId);

    if (!listing) {
      const error = new Error('Listing not found');
      error.status = 404;
      throw error;
    }

    const updates = {};
    if (title) updates.title = title;
    if (description) updates.description = description;

    await listing.update(updates);

    logger.info(`Listing updated: ${listing.id}`);
    return res.json(listing);
  });

  /**
   * @api {delete} /listings/:listingId Delete listing
   * @apiName DeleteListing
   * @apiGroup Listing
   */
  app.delete('/listings/:listingId', async (req, res) => {
    const listing = await Listing.findByPk(req.params.listingId);

    if (!listing) {
      const error = new Error('Listing not found');
      error.status = 404;
      throw error;
    }

    await listing.destroy();

    logger.info(`Listing deleted: ${req.params.listingId}`);
    return res.status(204).send();
  });
};

export default setupRoutes;
