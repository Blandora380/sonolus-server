import express from 'express'
import { Sonolus } from '@sonolus/express'

const app = express()
const sonolus = new Sonolus()

sonolus.load('./pack')

app.use('/sonolus', sonolus.router)

export default app
