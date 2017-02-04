import { DemandDAO } from '../models/demand'
import { IDemand } from '@prodest/mapeandoes-typings'
import { Services, Interfaces, Config } from 'js-data-dao'
import { Response, NextFunction } from 'express'

export class DemandController {
  collection: DemandDAO
  public constructor(collection: DemandDAO, appConfig: Config.AppConfig) {
    this.collection = collection
  }
  public find(req: any, res: Response, next?: NextFunction): Promise<IDemand> {
    return this.collection.find(req.params.id, req.user)
      .then((reg: IDemand) => {
        delete (reg as any).password
        res.status(200)
        return reg
      })
      .catch((error: Error) => {
        throw new Services.APIError(error.message, 400)
      })
  }

  public findSecure(req: any, res: Response, next?: NextFunction): Promise<IDemand> {
    return this.collection.findSecure(req.params.id, req.user)
      .then((reg: IDemand) => {
        delete (reg as any).password
        res.status(200)
        return reg
      })
      .catch((error: Error) => {
        throw new Services.APIError(error.message, 400)
      })
  }

  public findAll(req: any, res: Response, next?: NextFunction): Promise<IDemand[]> {
    return this.collection.findAll(req.query, req.user)
      .then((regs: IDemand[]) => {
        regs.map(reg => {
          delete (reg as any).password
          return reg
        })
        res.status(200)
        return regs
      })
      .catch((err : Error) => {
        throw new Services.APIError(err.message, 400)
      })
  }

  public findAllSecure(req: any, res: Response, next?: NextFunction): Promise<IDemand[]> {
    return this.collection.findAllSecure(req.query, req.user)
      .then((regs: IDemand[]) => {
        regs.map(reg => {
          delete (reg as any).password
          return reg
        })
        res.status(200)
        return regs
      })
      .catch((err : Error) => {
        throw new Services.APIError(err.message, 400)
      })
  }

  public create(req: any, res: Response, next?: NextFunction): Promise<IDemand> {
    let demand: any = req.body
    demand.externalUser = { id: req.userInfo.sub, name: req.userInfo.nome, email: req.userInfo.email }
    return this.collection.create(demand, req.user)
      .then((reg: IDemand) => {
        delete (reg as any).password
        res.status(201)
        return reg
      })
      .catch((error: Error) => {
        throw new Services.APIError(error.message, 400)
      })
  }

  public update(req: any, res: Response, next?: NextFunction): Promise<IDemand> {
    return this.collection.update(req.params.id, req.body, req.user)
      .then((reg: IDemand) => {
        delete (reg as any).password
        res.status(200)
        return reg
      })
      .catch((error: Error) => {
        throw new Services.APIError(error.message, 400)
      })
  }

  public delete(req: any, res: Response, next?: NextFunction): Promise<boolean> {
    return this.collection.delete(req.params.id, req.user)
      .then((isDeleted) => {
        res.status(200)
        return isDeleted
      })
      .catch(error => {
        throw new Services.APIError(error, 400)
      })
  }

  public query(req: any, res: Response, next?: NextFunction): Promise<Interfaces.IResultSearch<IDemand>> {
    return this.collection.paginatedQuery(req.body, req.user, req.query.page, req.query.limit)
      .then((result) => {
        result.result.map(reg => {
          delete (reg as any).password
          return reg
        })
        res.status(200)
        return result
      })
      .catch(error => {
        throw new Services.APIError(error, 400)
      })
  }

  public querySecure(req: any, res: Response, next?: NextFunction): Promise<Interfaces.IResultSearch<IDemand>> {
    return this.collection.paginatedQuerySecure(req.body, req.user, req.query.page, req.query.limit)
      .then((result) => {
        result.result.map(reg => {
          delete (reg as any).password
          return reg
        })
        res.status(200)
        return result
      })
      .catch(error => {
        throw new Services.APIError(error, 400)
      })
  }
}
