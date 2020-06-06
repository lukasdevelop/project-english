import express from 'express'
import { celebrate, Segments, Joi } from 'celebrate'
import multer from 'multer'
const routes = express.Router()
import multerConfig from './config/multer'
import AuthMiddleware from './middlewares/auth'
import HomeController from './controllers/HomeController'
import AuthController from './controllers/AuthController'
import ForumController from './controllers/ForumController'
import ProjectsController from './controllers/ProjectsController'

routes.get('/', HomeController.index)

routes.get('/dashboard', AuthMiddleware, HomeController.dashboard)

routes.post('/auth/register', celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
    facebook: Joi.string().allow('', null),
    github: Joi.string().required(),
    code: Joi.number().allow('', null)
  })
}), AuthController.create)

routes.get('/users', AuthController.index)

routes.delete('/users/:id', AuthController.excluir)

routes.post('/auth/sign', celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6)
  })
}), AuthController.authenticate)

routes.post('/auth/forgot-password', AuthController.forgotpassword)

routes.put('/auth/reset-password', celebrate({
  [Segments.BODY]: Joi.object().keys({
    password: Joi.string().required().min(6),
    token: Joi.string().required(),
  })
}), AuthController.resetpassword)

routes.post('/forum', multer(multerConfig).single('file'), ForumController.index)

routes.get('/projects', ProjectsController.index)

routes.post('/projects', celebrate({
  [Segments.BODY]: Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string().required(),
    author: Joi.string().required()
  })
}), ProjectsController.create)



export default routes
