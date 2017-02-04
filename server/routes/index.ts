import { GroupRouter } from './group-router'
import { UserRouter } from './user-router'
import * as express from 'express'
import * as JSData from 'js-data'
import { Config } from 'js-data-dao'

export namespace main {
  export const callRoutes = (app: express.Application, store: JSData.DataStore, passport: any, appConfig: Config.AppConfig): express.Application => {

    app.use('/api/v1/users', new UserRouter(store, appConfig).getRouter())
    app.use('/api/v1/groups', new GroupRouter(store, appConfig).getRouter())
    app.use('/api/v1/ping', (req, res, nex) => res.json('pong'))
    return app
  }
}
