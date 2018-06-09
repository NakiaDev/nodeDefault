'use strict'

const joi = require('joi')

const schema = joi.object({
    NODE_ENV: joi.string()
        .valid('development', 'production')
        .default('development'),
    PORT: joi.number()
        .default(3000)
}).unknown()
    .required()

const { error, value: vars } = joi.validate(process.env, schema)
if (error) {
    throw new Error(`Config validation error: ${error.message}`)
}

const Config = {
    NODE_ENV: vars.NODE_ENV,
    PORT: vars.PORT
}

module.exports = Config