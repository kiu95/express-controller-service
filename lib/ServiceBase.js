'use strict';

const HTTPError = require('node-http-error');
const {validateAll, sanitize} = require('indicative');

/**
 * Base class for service
 */
class ServiceBase {
	/**
	 * Create a service (called from controller)
	 * @param {Mongoose.model} model - Mongoose model that map to this controller/service
	 */
	constructor(model) {
		if (model) {
			this.model = model;
		}
		this.validateMsg = {};
		this.validateRule = {};
		this.sanitizationRules = {};
	}

	/**
	 * Validate input object from client side
	 * @param {Object} data - Data to be validated
	 */
	validate(data) {
		return validateAll(data, this.validateRule, this.validateMsg)
			.catch(error => {
				throw new HTTPError(400, error);
			});
	}

	sanitize(data) {
		return sanitize(data, this.sanitizationRules);
	}
}

module.exports = ServiceBase;
