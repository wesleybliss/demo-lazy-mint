import * as path from 'path'
import dotenv from 'dotenv'

if (!process.env.IS_CI)
    dotenv.config({ path: path.resolve(__dirname, '../.env') })
