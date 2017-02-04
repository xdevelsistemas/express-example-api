import { IDistrict, IUser } from '@prodest/mapeandoes-typings'
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
export class District extends Models.BaseModel implements IDistrict {
  name: string
  location: {
    lat: number,
    lon: number
  }
  constructor(obj: IDistrict) {
    super(obj.id)
    this.name = obj.name
    this.location = {
      lat: obj.location.lat,
      lon: obj.location.lon
    }
  }
}

/**
 * classe de persistencia da fonte de informação
 *
 * @export
 * @class SourceDAO
 * @extends {Models.DAO<ISource>}
 */
export class DistrictDAO extends Models.DAO<IDistrict> {
  storedb: JSData.DataStore
  serviceLib: Services.ServiceLib
  sendMail: Services.SendMail
  constructor(store: JSData.DataStore, appConfig: Config.AppConfig) {
    const districts = store.defineMapper('districts', {})
    super(districts)
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
  public create(obj: IDistrict, userP: any): Promise<IDistrict> {
    let district: District = new District(obj)
    let objFilterName = { where: { name: { '===': district.name } } }
    return this.collection.findAll(objFilterName)
      .then((districts: Array<IDistrict>) => {
        if (!_.isEmpty(districts)) {
          throw 'Existe outro distrito com o mesmo nome'
        } else {
          return this.collection.create(district)
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
  public update(id: string, user: IUser, obj: IDistrict): Promise<IDistrict> {
    let exclude = [
      'id', 'active', 'updatedAt', 'createdAt'
    ]
    let userFieldsUp = ['name']

    let newObj: IDistrict = Services.ServiceLib.fieldsUpValidator(obj, Object.keys(obj), userFieldsUp)

    return this.collection.find(id)
      .then((category: IDistrict) => {
        if (_.isEmpty(category)) { throw 'District not found.' }
        return Bluebird.all([category, newObj])
      })
      .then((resp: any) => {
        let districts: IDistrict = resp[0]
        let newObj: IDistrict = resp[1]
        return Bluebird.all([districts, newObj])
      })
      .then((resp: any) => {
        let district: IDistrict = resp[0]
        let newObj: IDistrict = resp[1]
        _.merge(district, newObj)
        if (!Services.ServiceLib.validateFields(district, Object.keys(district), exclude)) {
          throw 'Alguns dados estão em branco, preencha-os e tente novamente.'
        }
        return this.sendUpdate(id, district)
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
      .then((district: IDistrict) => {
        if (_.isEmpty(district)) {
          throw 'Fonte não encontrada'
        }
        let newObj: IDistrict = district
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
  public sendUpdate(id: string, obj: IDistrict): Promise<IDistrict> {
    return this.collection.update(id, obj)
  }

}
