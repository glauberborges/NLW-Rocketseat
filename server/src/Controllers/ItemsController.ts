import {Request, Response} from "express";
import knex from "../database/connection";

class ItemsController {

    async index (req: Request, res: Response) {
        const items = await knex('items').select('*');

        const serealizedItems = items.map(function (item) {
            return {
                id: item.id,
                title: item.title,
                // image_url: 'http://localhost:3333/uploads/'+item.image,
                image_url: 'http://192.168.1.100:3333/uploads/'+item.image,
            }
        })

        return res.send(serealizedItems);
    }
}

export default ItemsController;