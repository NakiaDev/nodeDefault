'use strict'

const winston = require('winston')

const utils = require('../../utils')

function Controller(err, req, res, next) {
    winston.error('error occurred inside a controller or a view', {
        controller: 'errors500Controller',
        requestId: req.id,
        url: req.url,
        originalUrl: req.originalUrl,
        request: {
            method: req.method,
            body: req.body,
        },
        error: utils.ConvertObjectEnumerable(err),
    })

    res.status(500)
    res.render('errors/500.ejs', {
        pageTitle: 'Server error',
    })
}

module.exports = Controller