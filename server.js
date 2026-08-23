import express from 'express'
import { Sonolus, SonolusSpaShare } from '@sonolus/express'

const app = express()
const sonolus = new Sonolus({
    banner: { url: '/banner.jpg' }
})
sonolus.load('./pack')

const sonolusShare = new SonolusSpaShare('./public')

app.use(sonolus.router)
app.use(sonolusShare.router)

export default app
