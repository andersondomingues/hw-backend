import prismaClient from '../prisma';

class LocationService {
  
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

    return addresses.map(x => `${x.name} ${x.state.acronym}`);
  }
}

export { LocationService };
