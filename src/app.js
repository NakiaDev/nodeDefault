'use strict'

const express = require('express')
const cookieParser = require('cookie-parser')
const ejsLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const winston = require('winston')
const requestId = require('express-request-id')

const config = require('./config')
const errors500Controller = require('./controllers/errors/500')
const routes = require('./routes')

const app = express()

app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')

app.use(ejsLayouts)
app.use(express.static('public'))
app.use('/bootstrap', express.static(__dirname + '/../node_modules/bootstrap/dist'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(requestId())

app.use(routes)
app.use(errors500Controller)

function Start() {
    app.listen(config.PORT)
    winston.info('the web server is listening', { port: config.PORT })
}

module.exports = {
    Start
}
