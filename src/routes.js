import express from 'express'
const routes = express.Router()
import AuthMiddleware from './middlewares/auth'
import HomeController from './controllers/HomeController'
import AuthController from './controllers/AuthController'

routes.get('/', HomeController.index)
routes.get('/dashboard', AuthMiddleware, HomeController.dashboard)
routes.post('/auth/register', AuthController.create)
routes.get('/users', AuthMiddleware, AuthController.index)
routes.get('/auth/sign', AuthController.authenticate)


export default routes
