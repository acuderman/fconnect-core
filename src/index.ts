import express from 'express'

const index: express.Express = express()
const port: string | number = process.env.PORT || 3000

index.listen(port, () => {
    console.log("Listening at http://localhost%s:%s", port)
})