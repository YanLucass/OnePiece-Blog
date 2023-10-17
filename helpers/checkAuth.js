module.exports = function checkAuth(req, res, next) {
    if(!req.session.userId) {
        res.redirect('/login');
        return;
    }
    // caso tenha
    next()
}
