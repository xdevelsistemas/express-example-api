import { IGroup } from './group'
import * as JSData from 'js-data'
import { Config, Services, Models, Interfaces } from 'js-data-dao'

/**
 * Model para os usuários
 *
 * @class User
 * @implements {Model.DAO<Model.User>}
 */
export interface IUser extends Interfaces.IBaseUser {
  group: IGroup
  groupId: string
}
export class User extends Models.BaseModel implements IUser {
  name: string
  email: string
  username: string
  companyAlias: string
  password: string
  isAdmin: boolean
  group: IGroup

  groupId: string

  constructor(obj: IUser) {
    super(obj)
    this.name = obj.name
    this.email = obj.email
    this.username = obj.username
    this.password = obj.password
    this.isAdmin = obj.isAdmin || false
    this.companyAlias = obj.companyAlias
    this.groupId = obj.groupId
  }
}

export class UserDAO extends Models.DAO<IUser> {
  storedb: JSData.DataStore
  serviceLib: Services.ServiceLib
  constructor(store: JSData.DataStore, config: Config.AppConfig) {

    let schema = {
      type: 'object',
      properties: {
        name: { type: 'string' },
        email: { type: 'string' },
        username: { type: 'string' },
        companyAlias: { type: 'string' },
        password: { type: 'string' },
        isAdmin: { type: 'boolean' },
        groupId: { type: 'string' }
      },
      required: ['name', 'email', 'password', 'username', 'groupId']
    }

    let relations = {
      belongsTo: {
        groups: {
          foreignKey: 'groupId',
          localField: 'group'
        }
      }
    }
    super(store, config.getUsersTable(), schema, relations , ['groups'])
  }

  public parseModel(val: any): IUser {
    return new User(val)
  }

}
