import { Controllers } from 'js-data-dao/lib/'
import { ThemeDAO } from '../models/theme'
import { ITheme } from '@prodest/mapeandoes-typings'
import * as JSData from 'js-data'
import { Config } from 'js-data-dao'

export class ThemeController extends Controllers.BasePersistController<ITheme> {
  public constructor(store: JSData.DataStore, appConfig: Config.AppConfig) {
    super(new ThemeDAO(store, appConfig))
  }
}
