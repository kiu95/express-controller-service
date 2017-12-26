'use strict';

const HTTPError = require('node-http-error');
const {validateAll, sanitize} = require('indicative');

const baseMsg = {
	'required': 'This field is required.'
};

/**
 * Base class for service
 */
class Service {
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
	validate(data, myRule, myMsg) {
		const rule = myRule || this.validateRule;
		const msg = myMsg || this.validateMsg;
		return validateAll(data, rule, msg)
			.catch(e => {
				throw new HTTPError(400, e);
			});
	}

	sanitize(data, myRule) {
		const rule = myRule || this.sanitizationRules;
		return sanitize(data, rule);
	}

	setVaidateRule(rule) {
		this.validateRule = rule;
	}

	setValidateMsg(msg) {
		this.validateMsg = {...baseMsg, ...msg};
	}

	setSanitizationRules(rule) {
		this.sanitizationRules = rule;
	}
}

module.exports = Service;
