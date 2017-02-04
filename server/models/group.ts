import * as JSData from 'js-data'
import { Config, Services, Models, Interfaces } from 'js-data-dao'

/**
 * Model para os usuários
 *
 * @class User
 * @implements {Model.DAO<Model.User>}
 */
export interface IGroup extends Interfaces.IBaseModel {
  name: string
}
export class Group extends Models.BaseModel implements IGroup {
  name: string

  constructor(obj: Interfaces.IBaseUser) {
    super(obj)
    this.name = obj.name
  }
}

export class GroupDAO extends Models.DAO<IGroup> {
  storedb: JSData.DataStore
  serviceLib: Services.ServiceLib
  constructor(store: JSData.DataStore, config: Config.AppConfig) {

    let schema = {
      type: 'object',
      properties: {
        name: { type: 'string' }
      },
      required: ['name']
    }
    super(store, 'groups', schema)
  }

  public parseModel(val: any): IGroup {
    return new Group(val)
  }

}
