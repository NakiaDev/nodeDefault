'use strict'

const express = require('express')

const indexController = require('./controllers/index')

const homeController = require('./controllers/home/home')

const errors404Controller = require('./controllers/errors/404')

const router = express.Router()

router.route('/')
    .get(indexController)

router.route('/home')
    .get(homeController)

router.route('*').all(errors404Controller)

module.exports = router