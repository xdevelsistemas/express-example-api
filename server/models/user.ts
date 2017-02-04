import { IUser } from '@prodest/mapeandoes-typings'
import { lib } from '../services/lib'
import * as Bluebird from 'bluebird'
import * as JSData from 'js-data'
import * as _ from 'lodash'
import { Config, Services, Models, Interfaces } from 'js-data-dao'
// import {validate, Contains, IsInt, Length, IsEmail, IsFQDN, IsDate, Min, Max} from 'class-validator'

/**
 * Model para os usuários
 *
 * @class User
 * @implements {Model.DAO<Model.User>}
 */

export class User extends Models.BaseModel implements IUser {
  name: string
  email: string
  username: string
  companyAlias: string
  password: string
  newPassword?: string
  isAdmin: boolean
  externalId: string

  constructor(obj: IUser) {
    super(obj.id)
    this.name = obj.name
    this.email = obj.email
    this.username = obj.username
    this.password = obj.password
    this.isAdmin = obj.isAdmin || false
    this.externalId = obj.externalId
    this.companyAlias = obj.companyAlias
  }
}

export class UserDAO extends Models.DAO<IUser> {
  storedb: JSData.DataStore
  serviceLib: Services.ServiceLib
  constructor(store: JSData.DataStore, appConfig: Config.AppConfig, userDef? : JSData.Mapper) {
    const users = userDef || store.defineMapper('users')
    super(users)
    this.storedb = store
    this.serviceLib = new Services.ServiceLib(appConfig)
  }

  /**
   * busca todos os usuários
   *
   * @param {Object} [query={}]
   * @param {*} user
   * @returns {Promise<Array<IUser>>}
   *
   * @memberOf UserDAO
   */
  public findAll(query: Object = {}, user: any): Promise<Array<IUser>> {
    return this.collection.findAll(query, this.options)
      .then((users: IUser[]) => {
        return users.map((d: IUser) => {
          return d
        })
      })
  }

  /**
   * Find aplicando auto-relacionamento manual de usuário para usuário
   * por conta do bug do belongsTo dando erro
   *
   * @param {string} id
   * @param {*} user
   * @returns {Promise<IUser>}
   *
   * @memberOf UserDAO
   */
  public find(id: string, user: any): Promise<IUser> {
    return this.collection.find(id, this.options)
      .then((user: IUser) => {
        if (user.active) {
          return user
        } else {
          throw 'Usuário não encontrado'
        }
      })
  }

  /**
   * Cria um novo usuário
   *
   * @param {User} obj
   * @param {*} userP
   * @returns {Promise<IUser>}
   *
   * @memberOf UserDAO
   */
  public create(obj: IUser, userP: any): Promise<IUser> {
    let user: User = new User(obj)
    let exclude: Array<string> = [
      'id', 'userId', 'active', 'isAdmin', 'updatedAt', 'createdAt', 'dataInclusao'
    ]
    let userValidado: string = lib.validandoUser(user)

    let objFilterEmail = { where: { email: { '===': user.email } } }
    // Pesquisa por usuário com o email e/ou documento igual ao do novo usuário
    return this.collection.findAll(objFilterEmail)
      .then((users: Array<IUser>) => {
        if (!_.isEmpty(users)) {
          throw 'O email já existe em outro usuário.'
        } else if (userValidado) {
          throw userValidado
        } else if (!Services.ServiceLib.validateFields(user, Object.keys(user), exclude)) {
          throw 'Alguns dados são obrigatórios, preencha-os e tente novamente.'
        } else {
          return Services.ServiceLib.hashPassword(user.password)
        }
      })
      .then((passwordCrypted: string) => {
        user.password = passwordCrypted
        return this.collection.create(user)
      })
      .then(() => obj)
  }

  /**
   * Atualiza os dados básicos do usuário
   * Como dados pessoais, email e senha.
   *
   * @param {string} id
   * @param {IUser} obj
   * @param {*} user
   * @returns {Promise<IUser>}
   *
   * @memberOf UserDAO
   */
  public update(id: string, obj: IUser, user: any): Promise<IUser> {
    let exclude = [
      'id', 'userId', 'active', 'isAdmin', 'updatedAt', 'createdAt', 'dataInclusao'
    ]
    let userFieldsUp = ['name', 'email', 'password', 'newPassword', 'telephone', 'zipCode',
      'address', 'number', 'complement', 'neighbor', 'city', 'state', 'country']

    let newObj: IUser = Services.ServiceLib.fieldsUpValidator(obj, Object.keys(obj), userFieldsUp)

    return this.collection.find(id)
      .then((user: IUser) => {
        if (_.isEmpty(user)) { throw 'Usuário não encontrado.' }
        if (newObj.password) {
          if (newObj.newPassword.length < 6) {
            throw 'A nova senha deve conter no mínimo 6 caracteres.'
          }
          return Bluebird.all([user, newObj, Services.ServiceLib.comparePassword(newObj.password, user.password)])
        }
        return Bluebird.all([user, newObj])
      })
      .then((resp: any) => {
        let user: IUser = resp[0]
        let newObj: IUser = resp[1]
        let passwordCompared: boolean = resp[2]

        if (passwordCompared) {
          return Bluebird.all([user, newObj, Services.ServiceLib.hashPassword(newObj.newPassword)])
        } else if (typeof passwordCompared === 'undefined') {
          return Bluebird.all([user, newObj])
        } else {
          throw 'A senha atual está incorreta'
        }
      })
      .then((resp: any) => {
        let user: IUser = resp[0]
        let newObj: IUser = resp[1]
        let passwordCrypted = resp[2]

        if (passwordCrypted) {
          newObj.password = passwordCrypted
        } else {
          delete newObj.password
        }
        delete newObj.newPassword
        _.merge(user, newObj)

        if (user.name.length < 6) {
          throw 'O nome deve conter no mínimo 6 letras.'
          // } else if (user.email && !EmailValidator.validate(user.email)) {
          //     throw 'O email possui um formato inválido.'
        } else if (!Services.ServiceLib.validateFields(user, Object.keys(user), exclude)) {
          throw 'Alguns dados estão em branco, preencha-os e tente novamente.'
        }
        return this.sendUpdate(id, user)
      })
  }

  /**
   * Deleta um usuário
   *
   * @param {string} id
   * @returns {Promise<boolean>}
   *
   * @memberOf UserDAO
   */
  public delete(id: string, user: any): Promise<boolean> {
    return this.collection.find(id)
      .then((user: IUser) => {
        if (_.isEmpty(user)) {
          throw 'Usuário não encontrado'
        }
        let newObj: IUser = user
        newObj.active = false
        return this.collection.update(id, newObj).then(() => true)
      })
  }

  /**
   * Atualiza dados de usuário
   *
   * @param {string} id
   * @param {IUser} obj
   * @returns {Promise<IUser>}
   *
   * @memberOf UserDAO
   */
  public sendUpdate(id: string, obj: IUser): Promise<IUser> {
    return this.collection.update(id, obj)
  }

  /**
   * realize search query using limits and page control
   *
   * @param {Object} search
   * @param {*} user
   * @param {number} [page]
   * @param {number} [limit]
   * @param {string[]} [order]
   * @returns {Promise<IResultSearch<IUser>>}
   *
   * @memberOf UserDAO
   */
  paginatedQuery(
    search: Object, user: any, page?: number, limit?: number, order?: string[]
  ): Promise<Interfaces.IResultSearch<IUser>> {
    let _page: number = page || 1
    let _limit: number = limit || 10
    let _order: string[] = []
    let params = Object.assign({}, search, {
      orderBy: _order,
      offset: _limit * (_page - 1),
      limit: _limit
    })

    return Promise.all([
      this.collection.findAll(search),
      this.collection.findAll(params)
    ])
      .then((resp: any) => {
        return {
          page: _page,
          total: resp[0].length,
          result: resp[1]
        } as Interfaces.IResultSearch<IUser>
      })
  }
}
