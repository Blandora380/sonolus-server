import express from 'express'
import { Sonolus, SonolusSpaShare } from '@sonolus/express'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { createGunzip } from 'node:zlib'

const app = express()
const sonolus = new Sonolus()
sonolus.load('./pack')

// Add engine configuration route for Sonolus 1.1.5 support
// Must be added before sonolus.router to take precedence over /sonolus/engines/:itemName
app.get('/sonolus/engines/:itemName/configuration', (req, res) => {
    const engineName = req.params.itemName
    const engine = sonolus.engine.items.find(e => e.name === engineName)

    if (!engine) {
        res.status(404).json({ error: 'Engine not found' })
        return
    }

    if (!engine.configuration) {
        res.status(404).json({ error: 'Engine configuration not found' })
        return
    }

    // Extract hash from the configuration URL
    const configUrl = engine.configuration.url
    const hash = configUrl.split('/').pop()

    // Try to serve from repository
    const repositoryPath = resolve('./pack/repository', hash)

    try {
        const configData = readFileSync(repositoryPath)

        // Check if file is gzipped (starts with gzip magic bytes 0x1f 0x8b)
        if (configData[0] === 0x1f && configData[1] === 0x8b) {
            // Decompress and send as JSON
            const gunzip = createGunzip()
            const chunks = []
            gunzip.on('data', chunk => chunks.push(chunk))
            gunzip.on('end', () => {
                const decompressed = Buffer.concat(chunks)
                res.set('Content-Type', 'application/json')
                res.send(decompressed)
            })
            gunzip.on('error', () => {
                res.status(500).json({ error: 'Failed to decompress configuration' })
            })
            gunzip.end(configData)
        } else {
            res.set('Content-Type', 'application/json')
            res.send(configData)
        }
    } catch (error) {
        // Fallback: try to read from source
        const sourcePath = resolve('./source/engines', engineName, 'configuration.json')
        try {
            const configData = readFileSync(sourcePath, 'utf8')
            res.set('Content-Type', 'application/json')
            res.send(configData)
        } catch (sourceError) {
            res.status(404).json({ error: 'Configuration file not found' })
        }
    }
})

const sonolusShare = new SonolusSpaShare('./public')

app.use(sonolus.router)
app.use(sonolusShare.router)

export default app