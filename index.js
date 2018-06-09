'use strict'

const winston = require('winston')
const moment = require('moment-timezone')
const fs = require('fs')
const less = require('less')
const postcss = require('postcss')
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')

const config = require('./src/config')
const utils = require('./src/utils')

const FILE_PATH_MAIN_LESS = '/src/style/main.less'
const FILE_PATH_STYLE_CSS = '/public/css/style.css'
const FILE_PATH_STYLE_MIN_CSS = '/public/css/style.min.css'

function unhandledRejectionLogger(err, promise) {
    winston.error('unhandled rejection', {
        promise: promise,
        error: utils.ConvertObjectEnumerable(err),
    })
}

function generateCss(callback) {
    fs.readFile(__dirname + FILE_PATH_MAIN_LESS, 'utf8', (err, data) => {
        if (err) {
            setImmediate(callback, err)
        } else {
            less.render(data, (err, res) => {
                if (err) {
                    setImmediate(callback, err)
                } else {
                    postcss([autoprefixer])
                        .process(res.css)
                        .then(res => {
                            if (res.warnings().length) {
                                winston.error('PostCSS warnings', { function: 'generateCss', warnings: res.warnings().map(warn => warn.toString()) })
                            }

                            try {
                                fs.writeFileSync(__dirname + FILE_PATH_STYLE_CSS, res.css, 'utf8')
                            }
                            catch (e) {
                                setImmediate(callback, e)
                                return
                            }

                            setImmediate(callback, null)
                        })
                }
            })
        }
    })
}

function minifyCss(callback) {
    fs.readFile(__dirname + FILE_PATH_STYLE_CSS, 'utf8', (err, data) => {
        if (err) {
            setImmediate(callback, err)
        } else {
            postcss([cssnano])
                .process(data)
                .then(res => {
                    if (res.warnings().length) {
                        winston.error('PostCSS warnings', { function: 'minifyCss', warnings: res.warnings().map(warn => warn.toString()) })
                    }

                    try {
                        fs.writeFileSync(__dirname + FILE_PATH_STYLE_MIN_CSS, res.css, 'utf8')
                    }
                    catch (e) {
                        setImmediate(callback, e)
                        return
                    }

                    setImmediate(callback, null)
                })
        }
    })
}

winston.remove(winston.transports.Console)
if (utils.IsDevEnv()) {
    winston.add(winston.transports.Console, {
        colorize: true,
        handleExceptions: true,
    })
} else {
    winston.add(winston.transports.Console, {
        json: true,
        stringify: true,
        handleExceptions: true,
    })
}

winston.info('app is starting', {
    nodeEnv: config.NODE_ENV,
    pid: process.pid,
    nodeVersion: process.version,
    platform: process.platform,
    architecture: process.arch,
    timezoneOffset: new Date().getTimezoneOffset() / 60,
})

process.on('unhandledRejection', unhandledRejectionLogger)

moment.tz.setDefault('Europe/Budapest')
moment.locale('hu')

winston.info('generating CSS style file...')

generateCss(err => {
    if (err) {
        winston.error('error occurred during CSS style generation', { error: utils.ConvertObjectEnumerable(err) })
    } else {
        winston.info('CSS style file is generated')
        minifyCss(err => {
            if (err) {
                winston.error('error occurred during CSS minification', { error: utils.ConvertObjectEnumerable(err) })
            } else {
                winston.info('minified CSS is created')
            }

            winston.info('starting the web server...')
            require('./src/app').Start()
        })
    }
})