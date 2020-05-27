import express from 'express'
const routes = express.Router()
import AuthMiddleware from './middlewares/auth'
import HomeController from './controllers/HomeController'
import AuthController from './controllers/AuthController'

routes.get('/', AuthMiddleware, HomeController.index)
routes.post('/auth/register', AuthController.create)
routes.get('/users', AuthController.index)
routes.get('/auth/sign', AuthController.authenticate)


export default routes
