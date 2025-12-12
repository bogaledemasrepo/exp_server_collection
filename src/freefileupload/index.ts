import express from 'express';
import { uploadAvator } from '../shoeshopapi/utils/file_upload.ts';
import { uploadFree } from '../shoeshopapi/services/UserServices.ts';

const freeUpload = express.Router();

freeUpload.post('/freeuploadavator',uploadAvator.single('photos'),uploadFree)

export default freeUpload;