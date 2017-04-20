module.exports = function(router) {
    router.get('/analytics/:campaign_id', function(request, response) {
        response.render('analytics', {user: request.user, logged_in: request.user != null});
    });
};
