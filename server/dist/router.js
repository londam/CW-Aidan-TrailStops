var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from 'express';
import * as Accommodation from './controllers/apiController.js';
import * as DB from './controllers/DBController.js';
const router = express.Router();
router.get('/mapMarkers', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield DB.getMarkers(req, res);
}));
router.post('/mapMarkers', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield DB.addMarker(req, res);
}));
router.put('/updateAllMarkers', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield DB.updateAllMarkers(req, res);
}));
router.delete('/mapMarkers', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield DB.removeMarker(req, res);
}));
router.post('/user', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield DB.addUser(req, res);
}));
router.get('/user', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield DB.getUser(req, res);
}));
router.get('/accommodation', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield DB.getAccommodation(req, res);
}));
router.put('/accommodation', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield DB.addAccommodation(req, res);
}));
router.get('/getAccommodation', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield Accommodation.getAccommodation(req, res);
}));
router.get('/accommodationPic', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield Accommodation.getAccommodationPic(req, res);
}));
router.get('/getAccommodationDetails', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield Accommodation.getAccommodationDetails(req, res);
}));
export default router;
