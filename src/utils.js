'use strict'

const config = require('./config')

function IsDevEnv() {
    return config.NODE_ENV === 'development'
}

function ConvertObjectEnumerable(obj) {
    const newObj = {}
    Object.getOwnPropertyNames(obj).forEach(property => {
        newObj[property] = obj[property]
    })
    return newObj
}

module.exports = {
    IsDevEnv,
    ConvertObjectEnumerable
}