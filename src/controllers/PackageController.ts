import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { PackageService } from '../services/PackageService';

class PackageController {

  static async insert(req: Request, res: Response) {
    
    const { description, cityId } = req.body.data;
    const newPackage = await PackageService.createPackage(description, cityId);

    return res.json(newPackage).status(httpStatus.CREATED);
  }

  static async getAll(req: Request, res: Response) {
    const packages = await PackageService.getPackages(); 
    return res.json(packages);
  }

  static async getByLocation(req: Request, res: Response) {

    const {location} = req.body;
    const locationFragments = location.split(' ');

    const state = locationFragments[locationFragments.length - 1];
    locationFragments.pop()

    const city = locationFragments.join(' ');
    const packages = await PackageService.getPackagesByLocation(city, state);

    return res.json(packages);
  }
}

export { PackageController };
