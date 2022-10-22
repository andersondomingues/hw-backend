import { prisma } from '@prisma/client';
import { countReset } from 'console';
import prismaClient from '../prisma';

/**
 * Groups CRUD operations for packages (items) and 
 * item history. 
 */
class PackageService {
  /**
   * Remove a package from the database 
   * @param index Index *code) of the package to be removed
   * @returns String informing the number of history records removed from
   * the database 
   */
  static async remove(index: number) {

    // remove the history of packages (list of locations) for the target package
    // @TODO: handle corner cases
    const deletionHistory = await prismaClient.packageLocation.deleteMany({
      where : {
        packageId : index
      }
    });

    // remove the package (item) from the database
    // @TODO: handle corner cases
    const deletion = await prismaClient.package.delete({
      where : {
        id: index
      }
    });

    return `Erased ${deletionHistory.count} record from history. Record erasing status: ${deletion.status}}.`;
  }

  /**
   * Insert a new packege into the database
   * @param description Description of the package
   * @param cityName Name of the warehouse city where the package is stored
   * @param stateAcronym Acronym (2 characteres) of the state where the package is stored
   * @returns String indicating the status of the operation
   */
  static async createPackage(description: string, cityName: string, stateAcronym: string) {

    // locate the state which has the acronym (assume US only)
    const state = await prismaClient.state.findFirst({
      where: {
        acronym: stateAcronym
      }
    })

    if(!state) return "ENABLE TO FIND STATE";

    // find the city, considers the found state
    const city = await prismaClient.city.findFirst({
      where : {
        name : cityName,
        stateId : state?.id
      },
      include: {
        state: true
      }
    });

    if(!city) return "UNABLE TO FIND CITY";

    // create a new package object 
    const packagg = await prismaClient.package.create({
      data : {
        description,
        locations: {
          create : {
            cityId: city.id
          }
        }
      }
    });

    if(!packagg) return "UNABLE TO CREATE PACKAGE";

    return {
      'id' : packagg.id,
      'description' : packagg.description
    }
  }

  /**
   * Move a package from one warehouse to another
   * NOTE: this method is unused, however it can be easily hooked 
   * to the route generation page to use of the generated route to 
   * actually move packages
   * @param packageId Id of package to be moved 
   * @param cityId Destination city (can't be the same as the current city)
   * @returns 
   */
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

    // check whether the current city is the same as the destination city
    if (currentLocation.cityId == cityId) {
      return "PACKAGE_IS_ALREADY_AT_DESTINATION";
    }

    const newLocation = await prismaClient.packageLocation.create({
      data : {
        cityId,
        packageId
      }
    })

    // create a new location entry in the database
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

  /**
   * Return all the packages stored in a given warehouse (city)
   */
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

  /**
   * Returns all packages (Storage screen)
   */
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
