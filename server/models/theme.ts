import { ITheme, IUser } from '@prodest/mapeandoes-typings'
import * as Bluebird from 'bluebird'
import * as JSData from 'js-data'
import * as _ from 'lodash'
import { Config, Services, Models } from 'js-data-dao'

/**
 * classe da fonte de informação
 *
 * @export
 * @class Theme
 * @extends {Models.BaseModel}
 * @implements {ITheme}
 */
export class Theme extends Models.BaseModel implements ITheme {
  name: string
  constructor(obj: ITheme) {
    super(obj.id)
    this.name = obj.name
  }
}

/**
 * classe de persistencia da fonte de informação
 *
 * @export
 * @class ThemeDAO
 * @extends {Models.DAO<ITheme>}
 */
export class ThemeDAO extends Models.DAO<ITheme> {
  storedb: JSData.DataStore
  serviceLib: Services.ServiceLib
  sendMail: Services.SendMail
  constructor(store: JSData.DataStore, appConfig: Config.AppConfig) {
    const users = store.defineMapper('themes')
    super(users, [])
    this.storedb = store
  }

  /**
   * Cria uma nova fonte de informação
   *
   * @param {User} obj
   * @param {*} userP
   * @returns {Promise<ITheme>}
   *
   * @memberOf ThemeDAO
   */
  public create(obj: ITheme, userP: any): Promise<ITheme> {
    let theme: Theme = new Theme(obj)
    let objFilterName = { where: { name: { '===': theme.name } } }
    return this.collection.findAll(objFilterName)
      .then((themes: Array<ITheme>) => {
        if (!_.isEmpty(themes)) {
          throw new Error('O Tema já está em uso')
        } else {
          return this.collection.create(theme)
        }
      })
      .then(() => obj)
  }

  /**
   * Atualiza uma fonte de informação
   *
   *
   * @param {string} id
   * @param {ITheme} obj
   * @param {*} user
   * @returns {Promise<ITheme>}
   *
   * @memberOf ThemeDAO
   */
  public update(id: string, user: IUser, obj: ITheme): Promise<ITheme> {
    let exclude = [
      'id', 'active', 'updatedAt', 'createdAt'
    ]
    let userFieldsUp = ['name']

    let newObj: ITheme = Services.ServiceLib.fieldsUpValidator(obj, Object.keys(obj), userFieldsUp)

    return this.collection.find(id)
      .then((theme: ITheme) => {
        if (_.isEmpty(theme)) { throw 'Temática não encontrada.' }
        return Bluebird.all([theme, newObj])
      })
      .then((resp: any) => {
        let theme: ITheme = resp[0]
        let newObj: ITheme = resp[1]
        return Bluebird.all([theme, newObj])
      })
      .then((resp: any) => {
        let theme: ITheme = resp[0]
        let newObj: ITheme = resp[1]
        _.merge(theme, newObj)
        if (!Services.ServiceLib.validateFields(theme, Object.keys(theme), exclude)) {
          throw 'Alguns dados estão em branco, preencha-os e tente novamente.'
        }
        return this.sendUpdate(id, theme)
      })
  }

  /**
   * Deleta uma fonte de informação
   *
   * @param {string} id
   * @returns {Promise<boolean>}
   *
   * @memberOf ThemeDAO
   */
  public delete(id: string, user: any): Promise<boolean> {
    return this.collection.find(id)
      .then((theme: ITheme) => {
        if (_.isEmpty(theme)) {
          throw 'Fonte não encontrada'
        }
        let newObj: ITheme = theme
        newObj.active = false
        return this.collection.update(id, newObj).then(() => true)
      })
  }

  /**
   * Atualiza dados da fonte de informação
   *
   * @param {string} id
   * @param {ITheme} obj
   * @returns {Promise<ITheme>}
   *
   * @memberOf ThemeDAO
   */
  public sendUpdate(id: string, obj: ITheme): Promise<ITheme> {
    return this.collection.update(id, obj)
  }

}
