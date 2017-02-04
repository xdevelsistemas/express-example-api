import { IDemand, ICategory, IDistrict, ITheme, ISource, IUser, IPin } from '@prodest/mapeandoes-typings'
import * as Bluebird from 'bluebird'
import * as JSData from 'js-data'
import * as _ from 'lodash'
import { Config, Services, Models, Interfaces } from 'js-data-dao'
import { Source } from './source'
import { Category } from './category'
/**
 * classe da fonte de informação
 *
 * @export
 * @class Source
 * @extends {Models.BaseModel}
 * @implements {ISource}
 */
export class Demand extends Models.BaseModel implements IDemand {
  title: string
  description: string
  externalUser: { id: string, name: string, email: string }
  categoryId: string
  category: ICategory
  userId: string
  user: IUser

  approved: boolean
  districts: IDistrict[]
  themes: ITheme[]
  source: ISource
  sourceId: string
  pins: IPin[]

  constructor(obj: IDemand) {
    super(obj.id)
    this.title = obj.title
    this.description = obj.description
    this.externalUser = obj.externalUser
    this.districts = obj.districts
    this.themes = obj.themes
    this.sourceId = obj.sourceId
    this.source = obj.source !== undefined ? new Source(obj.source) : null
    this.categoryId = obj.categoryId
    this.category = obj.category !== undefined ? new Category(obj.category) : null
    this.pins = obj.pins
    this.approved = obj.approved || false
  }
}

/**
 * classe de persistencia da fonte de informação
 *
 * @export
 * @class SourceDAO
 * @extends {Models.DAO<ISource>}
 */
export class DemandDAO extends Models.DAO<IDemand> {
  storedb: JSData.DataStore
  serviceLib: Services.ServiceLib
  constructor(store: JSData.DataStore, appConfig: Config.AppConfig) {
    const demands = store.defineMapper('demands', {
      relations: {
        belongsTo: {
          users: {
            localField: 'user',
            localKey: 'userId'
          },
          categories: {
            localField: 'category',
            localKey: 'categoryId'
          },
          sources: {
            localField: 'source',
            localKey: 'sourceId'
          }
        }
      }
    })
    super(demands, ['users', 'categories', 'sources'])
    this.storedb = store
  }

  /**
   * Cria uma nova fonte de informação
   *
   * @param {User} obj
   * @param {*} userP
   * @returns {Promise<ICategory>}
   *
   * @memberOf SourceDAO
   */
  public create(obj: IDemand, userP: any): Promise<IDemand> {
    let demand: Demand = new Demand(obj)
    return this.collection.create(demand)
  }

  /**
   * Atualiza uma fonte de informação
   *
   *
   * @param {string} id
   * @param {ICategory} obj
   * @param {*} user
   * @returns {Promise<ICategory>}
   *
   * @memberOf SourceDAO
   */
  public update(id: string, user: IUser, obj: IDemand): Promise<IDemand> {
    let exclude = [
      'id', 'active', 'updatedAt', 'createdAt', 'user', 'source', 'category'
    ]

    let userFieldsUp = ['title', 'description', 'externalUserId', 'demandId', 'categoryId', 'districts', 'themes', 'sourceId', 'pins']

    let newObj: IDemand = Services.ServiceLib.fieldsUpValidator(obj, Object.keys(obj), userFieldsUp)

    return this.collection.find(id)
      .then((demand: IDemand) => {
        if (_.isEmpty(demand)) { throw 'Demand not found.' }
        return Bluebird.all([demand, newObj])
      })
      .then((resp: any) => {
        let demands: IDemand = resp[0]
        let newObj: IDemand = resp[1]
        return Bluebird.all([demands, newObj])
      })
      .then((resp: any) => {
        let demand: IDemand = resp[0]
        let newObj: IDemand = resp[1]
        _.merge(demand, newObj)
        if (!Services.ServiceLib.validateFields(demand, Object.keys(demand), exclude)) {
          throw 'Alguns dados estão em branco, preencha-os e tente novamente.'
        }
        return this.sendUpdate(id, demand)
      })
  }

  /**
   * Deleta uma fonte de informação
   *
   * @param {string} id
   * @returns {Promise<boolean>}
   *
   * @memberOf SourceDAO
   */
  public delete(id: string, user: IUser): Promise<boolean> {
    return this.collection.find(id)
      .then((demand: IDemand) => {
        if (_.isEmpty(demand)) {
          throw 'Fonte não encontrada'
        }
        let newObj: IDemand = demand
        newObj.active = false
        return this.collection.update(id, newObj).then(() => true)
      })
  }

  /**
   * Atualiza dados da fonte de informação
   *
   * @param {string} id
   * @param {ICategory} obj
   * @returns {Promise<ICategory>}
   *
   * @memberOf SourceDAO
   */
  public sendUpdate(id: string, obj: IDemand): Promise<IDemand> {
    return this.collection.update(id, obj)
  }

  public findAll(query: any = {}, user: IUser): Promise<Array<Demand>> {
    if (query.where) {
      if (Array.isArray(query.where)) {
        query.where.push({ approved: true })
      } else {
        query.where = [query.where, { approved: true }]
      }
    } else {
      query.where = { approved: true }
    }
    return this.collection.findAll(query, this.options)
      .then((values: Demand[]) => {
        return values.map(d => new Demand(d))
      })
  }

  public findAllSecure(query: Object = {}, user: IUser): Promise<Array<Demand>> {
    return this.collection.findAll(query, this.options)
      .then((values: Demand[]) => {
        return values.map(d => new Demand(d))
      })
  }

  paginatedQuery(
    search: any, user: IUser, page?: number, limit?: number, order?: Array<string>
  ): Promise<Interfaces.IResultSearch<IDemand>> {
    let _page: number = page || 1
    let _limit: number = limit || 10
    let _order: string[] = []
    let params = Object.assign({}, search, {
      orderBy: _order,
      offset: _limit * (_page - 1),
      limit: _limit
    })

    if (search.where) {
      if (Array.isArray(search.where)) {
        search.where.push({ approved: true })
      } else {
        search.where = [search.where, { approved: true }]
      }
    } else {
      search.where = { approved: true }
    }

    return this.collection.findAll(search)
      .then((countResult) => {
        return this.collection.findAll(params, this.options)
          .then((results: IDemand[]) => {
            return {
              page: _page,
              total: countResult.length,
              result: results.map(d => new Demand(d))
            } as Interfaces.IResultSearch<IDemand>
          })
      })
  }

  paginatedQuerySecure(
    search: Object, user: IUser, page?: number, limit?: number, order?: Array<string>
  ): Promise<Interfaces.IResultSearch<IDemand>> {
    let _page: number = page || 1
    let _limit: number = limit || 10
    let _order: string[] = []
    let params = Object.assign({}, search, {
      orderBy: _order,
      offset: _limit * (_page - 1),
      limit: _limit
    })

    return this.collection.findAll(search)
      .then((countResult) => {
        return this.collection.findAll(params, this.options)
          .then((results: IDemand[]) => {
            return {
              page: _page,
              total: countResult.length,
              result: results.map(d => new Demand(d))
            } as Interfaces.IResultSearch<IDemand>
          })
      })
  }

  public find(id: string, user: any): Promise<IDemand> {
    return this.collection.find(id, this.options)
      .then((demand: IDemand) => {
        if (demand.approved) {
          return demand
        } else {
          throw 'Demanda não encontrada'
        }
      })
  }

  public findSecure(id: string, user: any): Promise<IDemand> {
    return this.collection.find(id, this.options)
      .then((demand: IDemand) => {
        return demand
      })
  }

}
