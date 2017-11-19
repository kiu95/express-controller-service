'use strict';

const {Router: r} = require('express');

class ControllerBase {
	// should pass this.constructor.name.replace('Controller', '') to name
	constructor(app, name, service, model) {
		this.name = name;
		if (service) {
			this.service = new service(model);
		}
		app.use(`/${this.name}`, r);
		this.render(r);
	}

	render(router) {
		console.error('ControllerBase.render() should be overwritten by subclass');
	}
}

module.exports = ControllerBase;
