import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { StatusCodes } from 'http-status-codes';
import { LocationService } from '../services/LocationService';

class LocationController {
  
  static async getAll(req: Request, res: Response) {
    try {
      const cities = await LocationService.getCities();
      return res.json(cities);
    } catch (e) { 
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
  
}

export { LocationController };
