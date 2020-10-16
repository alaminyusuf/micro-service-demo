import ListingsService from '#root/adapters/listingsService';

const listingsResolver = async () => {
  return await ListingsService.fetchAllListings();
};

export default listingsResolver;
