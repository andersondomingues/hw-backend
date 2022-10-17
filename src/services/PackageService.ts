import { prisma } from '@prisma/client';
import { countReset } from 'console';
import prismaClient from '../prisma';

class PackageService {
  
  static async createPackage(description: string, cityId: number) {

    const location = prismaClient.city.findUnique({
      where : {
        id : cityId
      }
    });

    if(!location) return "INVALID_CITY_ID";

    const packagg = await prismaClient.package.create({
      data : {
        description,
        locations: {
          create : {
            cityId,            
          }
        }
      }
    });

    return {
      'id' : packagg.id,
      'description' : packagg.description
    }
  }

  static async movePackage(packageId: number, cityId: number) {

    const packagg = await prismaClient.package.findUnique({
      where: {
        id: packageId
      }
    });

    if(!packagg) return "INVALID_PACKAGE_ID";

    const locations = await prismaClient.packageLocation.findMany({
      where: {
        packageId: packagg.id
      },
      orderBy: {
        datetime: 'asc'
      }
    });

    const currentLocation = locations[0];

    if (currentLocation.cityId == cityId) {
      return "PACKAGE_IS_ALREADY_AT_DESTINATION";
    }

    const newLocation = await prismaClient.packageLocation.create({
      data : {
        cityId,
        packageId
      }
    })

    if(newLocation){
      return {
        'packageId' : packageId,
        'cityId' : cityId,
        'datetime' : newLocation.datetime
      }
    } else {
      return "ERROR_WHILE_MOVING_PACKAGE";
    }
  }

  static async getPackagesByLocation(city: string, state: string){

    const locState = await prismaClient.state.findFirst({
      where: {
        acronym: state
      }
    });

    if(!locState) return "UNABLE_TO_FIND_STATE";

    const locCity = await prismaClient.city.findFirst({
      where: {
        name: city,
        stateId: locState.id
      },
      include: {
        state: {
          include: {
            country: true
          }
        }
      }
    })

    if(!locCity) return "UNABLE_TO_LOCATE_CITY";

    const packages = await prismaClient.package.findMany({
      where: {
        status : "ACTIVE",
      },
      include: {
        locations: {
          include: {
            city: {
              include: {
                state: true
              }
            }
          }
        }
      }
    });

    return packages
      .filter(x => x.locations[0].cityId == locCity.id)
      .map( x => { return {
        'id' : x.id,
        'description' : x.description,
        'location' : `${x.locations[0].city.name} ${x.locations[0].city.state.acronym}`
      }})
  }

  static async getPackages(){

    const packages = await prismaClient.package.findMany({
      where: {
        status : "ACTIVE"
      },
      include: {
        locations: {
          include: {
            city: {
              include: {
                state: true
              }
            }
          }
        }
      }
    });

    return packages.map( x => { return {
      'id' : x.id,
      'description' : x.description,
      'location' : `${x.locations[0].city.name} ${x.locations[0].city.state.acronym}`,
      'history' : x.locations.map(k => { return {
        'location' : `${k.city.name} ${k.city.state.acronym}`,
        'timestamp' : k.datetime
      }})
    }})
  }

}



export { PackageService };
