import { Request, Response } from  'express';
import knex from '../database/connection';

class PointsController {

	async index(req: Request, res: Response){
		const { city, uf, items} = req.query;

		const parsedItems = String(items)
			.split(',')
			.map(item => Number(item.trim()));

		console.log(req.query);
		const points = await knex('points')
			.join('points_items', 'points.id', '=', 'points_items.point_id')
			.whereIn('points_items.item_id', parsedItems)
			.where('city', String(city))
			.where('uf', String(uf))
			.distinct()
			.select('points.*');

		const serializedPoints = points.map(point => { 
			return {
				...point,
				image_url: `http://localhost:3333/uploads/${point.image}`
			}
		});

		return res.json(serializedPoints);
		
	}

	async show(req: Request, res: Response){

		//Getting the ID of the point
		const { id } = req.params;

		const point = await knex('points').where('id', id).first();

		if(!point){
			return res.status(400).json({message: 'Point not found'});
		}

		const serializedPoint  = {
			...point,
			image_url: `http://localhost:3333/uploads/${point.image}`
		};

	
		const items = await knex('items')
			.join('points_items', 'items.id', '=', 'points_items.item_id')
			.where('points_items.point_id', id)
			.select('items.title');
		return res.json({serializedPoint, items});
		

	}
	async create (req: Request, res: Response) {
	
		/*Object destructuring (getting properties
		from the JSON response). Items is an array
		of numbers*/
		const { 
			name,
			email, 
			whatsapp, 
			latitude, 
			longitude, 
			city, 
			uf, 
			items
		} = req.body;

		/*Creating a SQL transaction for redo things in case
		of an error*/
		const trx = await knex.transaction();


		

		const point = {
			image: req.file.filename,
			name,
			email, 
			whatsapp, 
			latitude, 
			longitude, 
			city, 
			uf
		}

		/*Adding the point into the SQL table and getting the
		ids of the added rows (in this case, just one)*/
		const insertedIds = await trx('points').insert(point);

		/*Getting the first and only ID of the points 
		inserted in the table*/
		const point_id = insertedIds[0];

		//Connecting the points ID with the items ID
		const pointsItems = items.split(',')
			.map(item => Number(item.trim()))
			.map((item_id: number) => {
				return {
					item_id,
					point_id: point_id
				}
			}
		);

		/*Adding the connected IDs in the points_items
		SQL table*/
		await trx('points_items').insert(pointsItems);
		await trx.commit();
		return res.json({
			id: point_id,
			...point
		});
	}


}


export default PointsController;