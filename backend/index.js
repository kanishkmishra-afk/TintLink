import express from 'express'
import cors from 'cors'
import { connectDB } from './config/db.js'
import dotenv from 'dotenv'
import healthRoutes from './routes/healthRoutes.js'
import linksRoutes from './routes/linkRoutes.js'   
import redirectRoutes from './routes/redirectRoutes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000
const CORS_ORIGIN ='http://localhost:5173'

app.use(express.json())
app.use(cors({ origin: CORS_ORIGIN }))

app.use('/', linksRoutes)
app.use('/', healthRoutes)
app.use('/', redirectRoutes)

app.get('/', (req, res) => {
  res.json({ status: 'OK', version: '1.0' })
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
  console.log(`CORS enabled for: ${CORS_ORIGIN}`)
  connectDB()
})
