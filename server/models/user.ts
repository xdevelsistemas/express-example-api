import * as JSData from 'js-data'
import { Config, Services, Models, Interfaces } from 'js-data-dao'

/**
 * Model para os usuários
 *
 * @class User
 * @implements {Model.DAO<Model.User>}
 */

export class User extends Models.BaseModel implements Interfaces.IBaseUser {
  name: string
  email: string
  username: string
  companyAlias: string
  password: string
  newPassword?: string
  isAdmin: boolean
  externalId: string

  constructor(obj: Interfaces.IBaseUser) {
    super(obj.id)
    this.name = obj.name
    this.email = obj.email
    this.username = obj.username
    this.password = obj.password
    this.isAdmin = obj.isAdmin || false
    this.companyAlias = obj.companyAlias
  }
}

export class UserDAO extends Models.DAO<Interfaces.IBaseUser> {
  storedb: JSData.DataStore
  serviceLib: Services.ServiceLib
  constructor(store: JSData.DataStore, appConfig: Config.AppConfig, userDef?: JSData.Mapper) {
    const users = userDef || store.defineMapper('users')
    super(users)
    this.storedb = store
    this.serviceLib = new Services.ServiceLib(appConfig)
  }

}

