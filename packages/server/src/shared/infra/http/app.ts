import 'reflect-metadata'
import 'dotenv/config'

import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import { errors } from 'celebrate'
import 'express-async-errors'

import router from './routes'
import AppError from '@shared/errors/AppError'
import uploadConfig from '@config/upload'
import rateLimiter from './middlewares/RateLimiter'

import '@shared/infra/typeorm'
import '@shared/container'

export const port = 4444

const app = express()

app.use(rateLimiter)
app.use(express.json())
app.use(cors())
app.use('/files', express.static(uploadConfig.uploadsFolder))
app.use(router)
app.use(errors())

app.use(
  (err: Error, request: Request, response: Response, next: NextFunction) => {
    if (err instanceof AppError) {
      return response.status(err.statusCode).json({
        status: 'error',
        message: err.message
      })
    }

    console.error(err)

    return response.status(500).json({
      status: 'error',
      message: 'Internal server error'
    })
  }
)

export default app
