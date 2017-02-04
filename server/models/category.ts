import { ICategory, IUser, ETravelMode } from '@prodest/mapeandoes-typings'
import * as Bluebird from 'bluebird'
import * as JSData from 'js-data'
import * as _ from 'lodash'
import { Config, Services, Models } from 'js-data-dao'

/**
 * classe da fonte de informação
 *
 * @export
 * @class Source
 * @extends {Models.BaseModel}
 * @implements {ISource}
 */
export class Category extends Models.BaseModel implements ICategory {
  name: string
  travelMode?: ETravelMode
  issue: boolean
  iconUrl: string
  markerColor: string
  idUser: string
  user: IUser
  constructor(obj: ICategory) {
    super(obj.id)
    this.name = obj.name
    this.travelMode = obj.travelMode || ETravelMode.walk
    this.issue = obj.issue || true
    this.iconUrl = obj.iconUrl
    this.markerColor = obj.markerColor
  }
}

/**
 * classe de persistencia da fonte de informação
 *
 * @export
 * @class SourceDAO
 * @extends {Models.DAO<ISource>}
 */
export class CategoryDAO extends Models.DAO<ICategory> {
  serviceLib: Services.ServiceLib
  sendMail: Services.SendMail
  constructor(store: JSData.DataStore, appConfig: Config.AppConfig) {
    const categories = store.defineMapper('categories',{
      relations: {
        belongsTo: {
          users: {
            localField: 'user',
            localKey: 'userId'
          }
        }
      }
    })
    super(categories, ['users'])
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
  public create(obj: ICategory, userP: any): Promise<ICategory> {
    let category: Category = new Category(obj)
    let objFilterName = { where: { name: { '===': category.name } } }
    return this.collection.findAll(objFilterName)
      .then((categories: Array<ICategory>) => {
        if (!_.isEmpty(categories)) {
          throw 'Existe outra categoria com mesmo nome'
        } else {
          category.idUser = userP ? userP.id : null
          return this.collection.create(category)
        }
      })
      .then(() => obj)
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
  public update(id: string, user: IUser, obj: ICategory): Promise<ICategory> {
    let exclude = [
      'id', 'active', 'updatedAt', 'createdAt', 'user'
    ]
    let userFieldsUp = ['name']

    let newObj: ICategory = Services.ServiceLib.fieldsUpValidator(obj, Object.keys(obj), userFieldsUp)

    return this.collection.find(id)
      .then((category: ICategory) => {
        if (_.isEmpty(category)) { throw 'Source not found.' }
        return Bluebird.all([category, newObj])
      })
      .then((resp: any) => {
        let category: ICategory = resp[0]
        let newObj: ICategory = resp[1]
        return Bluebird.all([category, newObj])
      })
      .then((resp: any) => {
        let category: ICategory = resp[0]
        let newObj: ICategory = resp[1]
        _.merge(category, newObj)
        if (!Services.ServiceLib.validateFields(category, Object.keys(category), exclude)) {
          throw 'Alguns dados estão em branco, preencha-os e tente novamente.'
        }
        category.idUser = user ? user.id : null
        return this.sendUpdate(id, category)
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
  public delete(id: string, user: any): Promise<boolean> {
    return this.collection.find(id)
      .then((category: ICategory) => {
        if (_.isEmpty(category)) {
          throw 'Fonte não encontrada'
        }
        let newObj: ICategory = category
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
  public sendUpdate(id: string, obj: ICategory): Promise<ICategory> {
    return this.collection.update(id, obj)
  }

}
