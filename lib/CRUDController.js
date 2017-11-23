'use strict';

const Controller = require('./Controller');
const CRUDService = require('./CRUDService');

/**
 * Subclass
 */
class CRUDController extends Controller {
	/**
	 * Create a Controller with basic CRUD operation
	 * @param {express.Router | express} app - The upper express router
	 * @param {String} name - Name of controller, should pass this.constructor.name.replace('Controller', '') from subclass
	 * @param {ServiceBase} service - Service that map to this controller
	 * @param {Mongoose.model} model - Mongoose model that map to this controller/service
	 * @param {express.Middleware} middlewares - Middlewares for data process/access control
	 */
	constructor(app, name, service, model, middlewares = []) {
		if (!(service && model)) {
			throw new Error('A CRUD Controller should have Service and Model');
		}
		if (!(service instanceof CRUDService)) {
			throw new Error('A service of CRUD Controller should be subclass of ServiceCRUDBase');
		}
		super(app, name, service, model);
		this.middlewares = middlewares;
		this.renderCRUD();
	}

	/**
	 * Set CRUD routing
	 */
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

module.exports = CRUDController;
