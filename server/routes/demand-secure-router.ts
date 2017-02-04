import { DemandDAO } from '../models/demand'
import * as JSData from 'js-data'
import { DemandController } from '../controllers'
import { Config, Routes } from 'js-data-dao'
import { Router } from 'express'
export class DemandSecureRouter extends Routes.BaseRouter {
  controller: DemandController
  router: Router

  constructor(store: JSData.DataStore, config: Config.AppConfig) {
    super()
    this.controller = new DemandController(new DemandDAO(store, config), config)
    this.router = Router()
    this.routers()
  }
  public routers() {
    let ctrl = this.controller
    /* GET lista todos os registros da classe corrente em controller. */
    this.router.get('/', (req: any, res, next) => this.respond(ctrl.findAllSecure(req, res, next), res))

    /* GET busca o registro com o id. */
    this.router.get('/:id', (req: any, res, next) => this.respond(ctrl.findSecure(req, res, next), res))

    /* POST cria um novo registro da classe corrente em controller. */
    this.router.post('/', (req: any, res, next) => this.respond(ctrl.create(req, res, next), res))

    /* PUT atualiza o registro. */
    this.router.put('/:id', (req: any, res, next) => this.respond(ctrl.update(req, res, next), res))

    /* DELETE deleta o registro com o id. */
    this.router.delete('/:id', (req: any, res, next) => this.respond(ctrl.delete(req, res, next), res))

    /* POST lista paginada com os registros da classe corrente em controller. */
    this.router.post('/query', (req: any, res, next) => this.respond(ctrl.querySecure(req, res, next), res))
  }

  public getRouter(): Router {
    return this.router
  }
}
