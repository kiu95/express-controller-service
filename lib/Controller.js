'use strict';

const express = require('express');

/**
 * Base class for controller
 */
class Controller {
	/**
	 * Create a controller
	 * @param {express.Router | express} app - The upper express router
	 * @param {String} name - Name of controller, should pass this.constructor.name.replace('Controller', '') from subclass
	 * @param {ServiceBase} service - Service that map to this controller
	 * @param {Mongoose.model} model - Mongoose model that map to this controller/service
	 */
	constructor(app, name, service, model) {
		this.name = name;
		this.router = express.Router();
		if (service) {
			this.service = new service(model);
		}
		app.use(`/${this.name}`, this.router);
		this.render();
	}

	/**
	 * Set route for this controller
	 */
	render() {
		console.error('ControllerBase.render() should be overwritten by subclass');
	}
}

module.exports = Controller;
