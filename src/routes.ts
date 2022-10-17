import { Router } from 'express';
import { LocationController } from './controllers/LocationController';
import { PackageController  } from './controllers/PackageController';
import { RoutesController  } from './controllers/RoutesController';

const router = Router();

router.get('/packages/get', PackageController.getAll);
router.get('/packages/put', PackageController.insert);
router.post('/packages/get/byLocation', PackageController.getByLocation);

router.get('/location/get', LocationController.getAll);

router.get('/location/route/get', RoutesController.getRoute);

export { router };
