'use strict'

function Controller(req, res) {
    res.status(404)
    res.render('errors/404.ejs', {
        pageTitle: 'Page not found!',
        url: req.originalUrl,
    })
}

module.exports = Controller