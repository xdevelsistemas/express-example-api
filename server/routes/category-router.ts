import * as JSData from 'js-data'
import { CategoryController } from '../controllers'
import { Routes, Config } from 'js-data-dao'
import { ICategory } from '@prodest/mapeandoes-typings'
export class CategoryRouter extends Routes.PersistRouter<ICategory, CategoryController> {
  constructor(store: JSData.DataStore, appConfig: Config.AppConfig) {
    let ctrl = new CategoryController(store, appConfig)
    super(store, ctrl)
  }
}
