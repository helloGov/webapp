module.exports = function(router) {
    router.get('/analytics/:campaign_id', function(request, response) {
        response.render('analytics', {logged_in: request.user != null});
    });
};
