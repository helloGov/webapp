
module.exports = function (router) {

    router.get('/createCampaign', (request, response) => {
		console.log(JSON.stringify(request.session));
		console.log('Cookies: ', request.cookies);
		console.log('Signed Cookies: ', request.signedCookies);
        response.render('create');
    });

};

