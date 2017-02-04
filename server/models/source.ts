import { ISource, IUser } from '@prodest/mapeandoes-typings'
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
export class Source extends Models.BaseModel implements ISource {
  name: string
  constructor(obj: ISource) {
    super(obj.id)
    this.name = obj.name
  }
}

/**
 * classe de persistencia da fonte de informação
 *
 * @export
 * @class SourceDAO
 * @extends {Models.DAO<ISource>}
 */
export class SourceDAO extends Models.DAO<ISource> {
  storedb: JSData.DataStore
  serviceLib: Services.ServiceLib
  sendMail: Services.SendMail
  constructor(store: JSData.DataStore, appConfig: Config.AppConfig) {
    const sources = store.defineMapper('sources')
    super(sources, [])
    this.storedb = store
  }

  /**
   * Cria uma nova fonte de informação
   *
   * @param {User} obj
   * @param {*} userP
   * @returns {Promise<ISource>}
   *
   * @memberOf SourceDAO
   */
  public create(obj: ISource, userP: any): Promise<ISource> {
    let source: Source = new Source(obj)
    let objFilterName = { where: { name: { '===': source.name } } }
    return this.collection.findAll(objFilterName)
      .then((sources: Array<ISource>) => {
        if (!_.isEmpty(sources)) {
          throw 'Existe outra fonte com mesmo nome'
        } else {
          return this.collection.create(source)
        }
      })
      .then((added: ISource) => added)
  }

  /**
   * Atualiza uma fonte de informação
   *
   *
   * @param {string} id
   * @param {ISource} obj
   * @param {*} user
   * @returns {Promise<ISource>}
   *
   * @memberOf SourceDAO
   */
  public update(id: string, user: IUser, obj: ISource): Promise<ISource> {
    let exclude = [
      'id', 'active', 'updatedAt', 'createdAt'
    ]
    let userFieldsUp = ['name']

    let newObj: ISource = Services.ServiceLib.fieldsUpValidator(obj, Object.keys(obj), userFieldsUp)

    return this.collection.find(id)
      .then((source: ISource) => {
        if (_.isEmpty(source)) { throw 'Source not found.' }
        return Bluebird.all([source, newObj])
      })
      .then((resp: any) => {
        let source: ISource = resp[0]
        let newObj: ISource = resp[1]
        return Bluebird.all([source, newObj])
      })
      .then((resp: any) => {
        let source: ISource = resp[0]
        let newObj: ISource = resp[1]
        _.merge(source, newObj)
        if (!Services.ServiceLib.validateFields(source, Object.keys(source), exclude)) {
          throw 'Alguns dados estão em branco, preencha-os e tente novamente.'
        }
        return this.sendUpdate(id, source)
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
      .then((source: ISource) => {
        if (_.isEmpty(source)) {
          throw 'Fonte não encontrada'
        }
        let newObj: ISource = source
        newObj.active = false
        return this.collection.update(id, newObj).then(() => true)
      })
  }

  /**
   * Atualiza dados da fonte de informação
   *
   * @param {string} id
   * @param {ISource} obj
   * @returns {Promise<ISource>}
   *
   * @memberOf SourceDAO
   */
  public sendUpdate(id: string, obj: ISource): Promise<ISource> {
    return this.collection.update(id, obj)
  }

}
