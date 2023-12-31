module.exports = theFunc => (req, res, next) => {
    Promise.resolve(theFunc(req, res, next)).catch(next)
}
// If the Promise resolves successfully, the middleware function does nothing and simply calls the next function to continue processing the request. 
// If the Promise rejects, the middleware function calls the next function with the error generated by the rejection of the Promise.