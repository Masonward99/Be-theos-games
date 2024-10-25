import express from 'express';
const apiRouter = express.Router()

apiRouter.get('/', (req, res) => {
    console.log('testing endpoint')
    res.send('test')
}
)
export default apiRouter