import { Request, Response } from 'express';
import { GoogleMapsService } from '../services/GoogleMapsService';
import { StatusCodes } from 'http-status-codes';

class RoutesController {

  static async getRoute(req: Request, res: Response) {
    try {
      const { origin, destinations } = req.body;
      const routes = await GoogleMapsService.getDirections(origin, destinations);
      return res.json(routes);
    } catch (e) {
      console.log(e);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

export { RoutesController };
