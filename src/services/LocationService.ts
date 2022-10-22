import prismaClient from '../prisma';

/**
 * Groups location services for warehouses. 
 */
class LocationService {
  
  /**
   * @returns A list of warehouses from the database.
   */
  static async getCities() {
    
    const addresses = await prismaClient.city.findMany({
      include: {
        state: {
          include: {
            country: true
          },
        },
      },
    });

    // Remove indexing information. Locations are identified 
    // by their string representation only.
    return addresses.map(x => `${x.name} ${x.state.acronym}`);
  }
}

export { LocationService };
