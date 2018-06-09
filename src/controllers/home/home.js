'use strict'

function Controller(req, res) {
    res.render('home/home.ejs', {
        pageTitle: 'Home',
        url: req.originalUrl,
    })
}

module.exports = Controller