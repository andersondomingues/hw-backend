import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { StatusCodes } from 'http-status-codes';
import { PackageService } from '../services/PackageService';

class PackageController {

  static parseAddress(location: string){
    const locationFragments = location.split(' ');
    const stateAcronym = locationFragments[locationFragments.length - 1];
    locationFragments.pop()
    const cityName = locationFragments.join(' ');
    
    return {
      cityName, 
      stateAcronym
    };
  }

  static async remove(req: Request, res: Response) {
    try {
      const {index} = req.body;
      const deletionResult = await PackageService.remove(index);
      return res.json(deletionResult).status(httpStatus.OK);
    } catch (e) {
      console.log(e);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  static async insert(req: Request, res: Response) {
    try {
      const { description, location } = req.body;
      const { cityName, stateAcronym } = PackageController.parseAddress(location);

      const newPackage = await PackageService.createPackage(description, cityName, stateAcronym);
      return res.json(newPackage).status(httpStatus.CREATED);
    } catch (e) {
      console.log(e);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const packages = await PackageService.getPackages(); 
      return res.json(packages);
    } catch (e) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR)
    }
  }

  static async getByLocation(req: Request, res: Response) {
    try {
      const {location} = req.body;
      const { cityName, stateAcronym } = PackageController.parseAddress(location);
      const packages = await PackageService.getPackagesByLocation(cityName, stateAcronym);

      return res.json(packages);
    } catch (e) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

export { PackageController };
