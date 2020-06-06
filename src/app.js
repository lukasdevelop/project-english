import express from 'express'
import routes from './routes'
import cors from 'cors'
import dotenv from 'dotenv'
import { errors } from 'celebrate'
import morgan from 'morgan'
dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true}))
app.use(morgan('dev'))
app.use(routes)
app.use(errors())

export default app
