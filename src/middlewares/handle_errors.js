import createError from 'http-errors'
export const badRequest = (err, res) => {
    const error = createError.BadRequest(err)
    return res.status(error.status).json({
        error: 1,
        message: error.message 
    })
}

export const internalServerError = (res) => {
    const error = createError.InternalServerError()
    return res.status(error.status).json({
        error: 1,
        message: error.message 
    })
}

export const notFound = (req, res) => {
    const error = createError.NotFound('This route is not defined')
    return res.status(error.status).json({
        error: 1,
        message: error.message 
    })
}

export const notAuthorized = (err, res) => {
    const error = createError.Unauthorized(err)
    return res.status(error.status).json({
        error: 1,
        message: error.message 
    })
}