import express from 'express'
import { Sonolus } from '@sonolus/express'

const app = express()
const sonolus = new Sonolus()
sonolus.load('./pack')

const sonolusShare = new SonolusSpaShare('./public')

app.use(sonolus.router)
app.use(sonolusShare.router)

export default app
