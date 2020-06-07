import {Request, Response} from "express";
import knex from "../database/connection";

class PointsController {

    async index (req: Request, res: Response) {
        const {city, uf, items} = req.query

        const parseItems = String(items)
            .split(',')
            .map(function (items) {
                return Number(items.trim())
            })

        const points = await knex('points')
            .join('points_items_pv', 'points.id', '=', 'points_items_pv.points_id')
            .whereIn('points_items_pv.items_id', parseItems)
            .where('uf', String(uf))
            .where('city', String(city))
            .distinct()
            .select('points.*');
            // .select('points.*').toSQL();

        const serealizedPoints = points.map(function (point) {
            return {
                ...point,
                image_url: 'http://192.168.1.100:3333/uploads/'+point.image,
            }
        })

        return res.status(200).json(serealizedPoints);

    }

    async show (req: Request, res: Response) {
        const id = req.params.id

        const point = await knex('points').where('id', id).first();

        if(!point){
            return res.status(400).json({mensagem: "Nenhum registro encontrado"});
        }

        const serealizedPoint =  {
            ...point,
            image_url: 'http://192.168.1.100:3333/uploads/'+point.image,
        };

        const items = await knex('items')
            .join('points_items_pv', 'items.id', '=', 'points_items_pv.items_id')
            .where('points_id', point.id);

        return res.status(200).json({ point: serealizedPoint, items});
    }

    async create (req: Request, res: Response) {

        const  {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            number,
            uf,
            items
        } = req.body;

        const trx = await knex.transaction();

        const points = {
            image: req.file.filename,
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            number,
            uf
        };

        const insert_ids = await trx('points').insert(points);

        const points_id = insert_ids[0]
        const poninItems = items.split(',').map((items_id: number) => {
            return {
                items_id,
                points_id,
            }
        });

        await trx('points_items_pv').insert(poninItems);

        await trx.commit()

        return res.json({
            id: insert_ids[0],
            ...points
        });
    }
};

export default PointsController;