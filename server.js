import express from 'express'
import { Sonolus } from '@sonolus/express'

const app = express()
const sonolus = new Sonolus()

sonolus.load('./pack')  // atau './pack' kalau nggak di-rename ke 'source'

app.use('/sonolus', sonolus.router)

app.listen(8000, () => {
    console.log('Server jalan di port 8000')
})
