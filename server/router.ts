import express, { Request, Response } from 'express';
import * as Accommodation from './controllers/apiController.js';
import * as DB from './controllers/DBController.js';

const router = express.Router();

router.get('/mapMarkers', async (req: Request, res: Response) => {
  await DB.getMarkers(req, res);
});

router.post('/mapMarkers', async (req: Request, res: Response) => {
  await DB.addMarker(req, res);
});

router.put('/updateAllMarkers', async (req: Request, res: Response) => {
  await DB.updateAllMarkers(req, res);
});

router.delete('/mapMarkers', async (req: Request, res: Response) => {
  await DB.removeMarker(req, res);
});

router.post('/user', async (req: Request, res: Response) => {
  await DB.addUser(req, res);
});

router.get('/user', async (req: Request, res: Response) => {
  await DB.getUser(req, res);
});

router.get('/accommodation', async (req: Request, res: Response) => {
  await DB.getAccommodation(req, res);
});

router.put('/accommodation', async (req: Request, res: Response) => {
  await DB.addAccommodation(req, res);
});

router.get('/getAccommodation', async (req: Request, res: Response) => {
  await Accommodation.getAccommodation(req, res);
});

router.get('/accommodationPic', async (req: Request, res: Response) => {
  await Accommodation.getAccommodationPic(req, res);
});

router.get('/getAccommodationDetails', async (req: Request, res: Response) => {
  await Accommodation.getAccommodationDetails(req, res);
});

export default router;
