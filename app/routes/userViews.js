
module.exports = function (router) {
    router.get('/createCampaign', (request, response) => {
        response.render('create', 
        	{"body-class": "white-form"}
        );
    });
};

