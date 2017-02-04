import { Controllers } from 'js-data-dao/lib/'
import { CategoryDAO } from '../models/category'
import { ICategory } from '@prodest/mapeandoes-typings'
import * as JSData from 'js-data'
import { Config } from 'js-data-dao'

export class CategoryController extends Controllers.BasePersistController<ICategory> {
  public constructor(store: JSData.DataStore, appConfig: Config.AppConfig) {
    super(new CategoryDAO(store, appConfig))
  }
}
