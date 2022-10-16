import { Router } from 'express';
import { LocationController } from './controllers/LocationController';
import { PackageController  } from './controllers/PackageController';

const router = Router();

router.get('/packages/get', PackageController.getAll);
router.get('/packages/put', PackageController.insert);
router.post('/packages/get/byLocation', PackageController.getByLocation);

router.get('/location/get', LocationController.getAll);

export { router };
