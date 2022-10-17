import { Request, Response } from 'express';
import { GoogleMapsService } from '../services/GoogleMapsService';

class RoutesController {

  static async getRoute(req: Request, res: Response) {
    
    // const { description, cityId } = req.body.data;
    const a = "Porto Alegre RS";
    const b = "Sapucaia RS";

    const routes = await GoogleMapsService.getDirections(a, b);
    console.log(routes)
    return res.json(routes);
  }

}

export { RoutesController };
