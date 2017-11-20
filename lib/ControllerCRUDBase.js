'use strict';

const ControllerBase = require('./ControllerBase');
const ServiceCRUDBase = require('./ServiceCRUDBase');

class ControllerCRUDBase extends ControllerBase {
	constructor(app, name, service, model, middlewares = []) {
		if (!(service && model)) {
			throw new Error('A CRUD Controller should have Service and Model');
		}
		if (!(service instanceof ServiceCRUDBase)) {
			throw new Error('A service of CRUD Controller should be subclass of ServiceCRUDBase');
		}
		super(app, name, service, model);
		this.middlewares = middlewares;
		this.renderCRUD();
	}

	renderCRUD() {
		const {router, middlewares} = this;

		router.post('/', ...middlewares, async (req, res) => {
			const {service} = this;
			const result = await service.create(req.body);
			res.json(result);
		});

		router.get('/', ...middlewares, async (req, res) => {
			const {service} = this;
			const result = await service.getAll();
			res.json(result);
		});

		router.get('/:_id', ...middlewares, async (req, res) => {
			const {service} = this;
			const result = await service.getById(req.params._id);
			res.json(result);
		});

		router.put('/:_id', ...middlewares, async (req, res) => {
			const {service} = this;
			const result = await service.update(req.params._id, req.body);
			res.json(result);
		});

		router.delete('/:_id', ...middlewares, async (req, res) => {
			const {service} = this;
			const result = await service.delete(req.params._id);
			res.json(result);
		});
	}
}

module.exports = ControllerCRUDBase;
