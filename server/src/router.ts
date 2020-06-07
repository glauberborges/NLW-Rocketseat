import express from 'express';
import PointsController from "./Controllers/PointsController";
import ItemsController from "./Controllers/ItemsController";
import multer from 'multer';
import multerConfig  from './config/multer'
import {celebrate, Joi} from 'celebrate'

const router = express.Router();
const upload = multer(multerConfig);
const pointsControllers = new PointsController();
const itemsController = new ItemsController();

router.get('/', function (request, response) {
    return response.send("Home Page");
})

router.get('/items', itemsController.index )

router.get('/points', pointsControllers.index)

router.post('/points', upload.single('image'),
    celebrate({
        body: Joi.object().keys({
            name: Joi.string().required(),
            email: Joi.string().required().email(),
            whatsapp: Joi.string().required(),
            latitude: Joi.number().required(),
            longitude: Joi.number().required(),
            city: Joi.string().required(),
            number: Joi.string(),
            uf: Joi.string().required().max(2),
            items: Joi.string().required(),
        })
    },{
        abortEarly: false
    }),
    pointsControllers.create)

router.get('/points/:id', pointsControllers.show)


export default router;