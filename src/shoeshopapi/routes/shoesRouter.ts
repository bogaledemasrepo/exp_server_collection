import express from 'express';
import { addShoes, getAllShoes ,getShoesPaginated,updateShoes,deleteShoes} from '../services/ShoeServices.ts';
import { uploadShoes } from '../utils/file_upload.ts';

const shoesRouter = express.Router();

shoesRouter.get('/',getAllShoes);
shoesRouter.get('/paged',getShoesPaginated);
shoesRouter.post('/',uploadShoes.single('image'),addShoes);
shoesRouter.put('/:id',uploadShoes.single('image'),updateShoes);
shoesRouter.delete('/:id',deleteShoes);

export default shoesRouter;