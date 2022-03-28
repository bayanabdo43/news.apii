const express = require('express')
const app = express()
const port = process.env.PORT || 3000
require('./db/mongoose')

require("dotenv").config()

app.User(express.json())
const UserRouter = require('./router/user')
app.use(UserRouter)

const newsRouter = require("./routers/news")
app.use(newsRouter)


app.listen(port,()=>{console.log('server is running')})