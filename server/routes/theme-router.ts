import * as JSData from 'js-data'
import { ThemeController } from '../controllers'
import { Routes, Config } from 'js-data-dao'
import { ITheme } from '@prodest/mapeandoes-typings'
export class ThemeRouter extends Routes.PersistRouter<ITheme, ThemeController> {
  constructor(store: JSData.DataStore, appConfig: Config.AppConfig) {
    let ctrl = new ThemeController(store, appConfig)
    super(store, ctrl)
  }
}
