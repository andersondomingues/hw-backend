import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { LocationService } from '../services/LocationService';

class LocationController {

  static async getAll(req: Request, res: Response) {
    const cities = await LocationService.getCities();
    return res.json(cities);
  }
}

export { LocationController };
