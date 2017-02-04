import { UserRouter } from './user-router'
import { SourceRouter } from './source-router'
import { DistrictRouter } from './district-router'
import { ThemeRouter } from './theme-router'
import { DemandRouter } from './demand-router'
import { DemandSecureRouter } from './demand-secure-router'
import { CategoryRouter } from './category-router'
import * as express from 'express'
import * as JSData from 'js-data'
import { Config } from 'js-data-dao'
const apiMiddleware = require('node-mw-api-prodest').middleware
import { duration, max, perSecond } from '../config/api-middleware'
import { jwtPublicKey } from '../config/acesso-cidadao'
import { redisUrl } from '../config/redis'
import { userInfoUrl } from '../config/acesso-cidadao'
const validateAtEndpoint = require('node-mw-api-prodest').validateAtEndpoint(userInfoUrl)

export namespace main {
  export const callRoutes = (app: express.Application, store: JSData.DataStore, passport: any, appConfig: Config.AppConfig): express.Application => {

    app.use('/api/v1/users', new UserRouter(store, appConfig).getRouter())
    app.use('/api/v1/sources', new SourceRouter(store, appConfig).getRouter())
    app.use('/api/v1/districts', new DistrictRouter(store, appConfig).getRouter())
    app.use('/api/v1/themes', new ThemeRouter(store, appConfig).getRouter())
    app.use('/api/v1/demands', new DemandRouter(store, appConfig).getRouter())
    app.use('/api/v1/categories', new CategoryRouter(store, appConfig).getRouter())
    app.use('/api/v1/ping', (req, res, nex) => res.json('pong'))
    app.use(apiMiddleware({
      compress: true,
      cors: true,
      authentication: {
        jwtPublicKey: jwtPublicKey
      },
      limit: {
        max: parseInt(max, 10),
        duration: parseInt(duration, 10) * 60 * 1000,
        perSecond: parseInt(perSecond, 10),
        redisUrl: redisUrl,
        apiId: 'api-detran'
      }
    }))

    app.use('/api/v1/secure/demands', validateAtEndpoint, new DemandSecureRouter(store, appConfig).getRouter())
    /**
     * rota para obter dados do usuário logado
     */
    // app.use('/api/v1/me', (req, res, next) => {
    //     let user = req.user
    //     delete user['password']
    //     return res.json(user)
    // })
    return app
  }
}
