'use strict';

const HTTPError = require('node-http-error');
const ServiceBase = require('./ServiceBase');

class ServiceCRUDBase extends ServiceBase {
	async create(obj) {
		const {validate, sanitize, model} = this;
		await validate(obj);
		const newData = new model(sanitize(obj));
		await newData.save();

		return newData.toJSON();
	}

	async getAll(toObj = false) {
		const {model} = this;
		let result = await model.find({}).exec();
		if (toObj) {
			result = result.map(m => m.toJSON());
		}

		return result;
	}

	async getById(_id, toObj = false) {
		const {model} = this;
		let result = await model.findOne({_id}).exec();
		if (toObj) {
			result = result.toJSON();
		}

		return result;
	}

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

	async delete(_id) {
		const {model} = this;
		const result = await model.findByIdAndRemove(_id).exec();
		if (!result) {
			throw new HTTPError(404, 'Not Found');
		}
		return result.toJSON();
	}
}

module.exports = ServiceCRUDBase;
