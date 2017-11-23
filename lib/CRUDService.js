'use strict';

const HTTPError = require('node-http-error');
const Service = require('./Service');

/**
 * Service to handle basic CRUD request
 */
class CRUDService extends Service {
	/**
	 * Create
	 * @param {object} obj Data to be inserted to DB
	 */
	async create(obj) {
		const {validate, sanitize, model} = this;
		await validate(obj);
		const newData = new model(sanitize(obj));
		await newData.save();

		return newData.toJSON();
	}

	/**
	 * Read - get all documents in collection
	 * @param {boolean} toObj Return simple JS object or not
	 */
	async getAll(toObj = true) {
		const {model} = this;
		let result = await model.find({}).exec();
		if (toObj) {
			result = result.map(m => m.toJSON());
		}

		return result;
	}

	/**
	 * Read - get document by ObjectID
	 * @param {string|ObjectId} _id ObjectID of target document
	 * @param {boolean} toObj Return simple JS object or not
	 */
	async getById(_id, toObj = false) {
		const {model} = this;
		let result = await model.findOne({_id}).exec();
		if (toObj) {
			result = result.toJSON();
		}

		return result;
	}

	/**
	 * Update
	 * @param {string|ObjectId} _id ObjectID of target document to be updated
	 * @param {object} obj New document to be replaced
	 * @param {boolean} toObj Return simple JS object or not
	 */
	async update(_id, obj, toObj = false) {
		const {validate, sanitize, model} = this;
		await validate(obj);
		obj = sanitize(obj);

		try {
			await model.update({_id}, {$set: obj});
			if (toObj) {
				obj = obj.toJSON();
			}
			return obj;
		} catch (e) {
			throw new HTTPError(400, e);
		}
	}

	/**
	 * Delete
	 * @param {string|ObjectId} _id ObjectID of target document to be deleted
	 */
	async delete(_id) {
		const {model} = this;
		const result = await model.findByIdAndRemove(_id).exec();
		if (!result) {
			throw new HTTPError(404, 'Not Found');
		}
		return result.toJSON();
	}
}

module.exports = CRUDService;
