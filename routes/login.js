var express = require('express');
var router = express.Router();
var ApiConf = require("./../config").aerohive;


/*================================================================
 ROUTES
 ================================================================*/
/*================================================================
 DASHBOARD
 ================================================================*/
router.get('/', function (req, res, next) {
  var errorcode;
  if (req.query.hasOwnProperty('errorcode')) errorcode = req.query["errorcode"];
  res.render('login', { title: 'Analytics', errorcode: errorcode, client_id: ApiConf.clientId, redirect_uri: ApiConf.redirectUrl });
});
router.post('/', function (req, res, next) {
  var ownerIdRegexp = new RegExp("^[0-9]*$");
  var accessTokenRegexp = new RegExp("^[a-zA-Z0-9]{40}$");
  var apiServers = ["cloud-va.aerohive.com", "cloud-ie.aerohive.com"];
  if (!(req.body.hasOwnProperty("vpcUrl") && apiServers.indexOf(req.body["vpcUrl"]) >= 0)) {
    res.redirect("/?errorcode=1");
  } else if (!(req.body.hasOwnProperty("ownerID") && ownerIdRegexp.test(req.body['ownerID']))) {
    res.redirect("/?errorcode=2");
  } else if (!req.body.hasOwnProperty("accessToken")) {
    res.redirect("/?errorcode=3");
  } else {
    req.session.xapi = {
      owners: [],
      ownerIndex: 0,
      rejectUnauthorized: true,
      current: function () {
        return req.session.xapi.owners[req.session.xapi.ownerIndex];
      }
    };
    req.session.xapi.owners.push({
      vhmId: "N/A",
      ownerId: req.body["ownerID"],
      vpcUrl: req.body["vpcUrl"],
      accessToken: req.body["accessToken"].trim()
    });
    console.log(req.session.xapi);
    res.redirect('/dashboard/');
  }
});
router.get('/howto/', function (req, res, next) {
  res.render('howto', { title: 'Analytics' });
});
router.get('/help/', function (req, res, next) {
  res.render('help', { title: 'Analytics' });
});
router.get('/logout/', function (req, res, next) {
  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
    }
    else {
      res.redirect('/');
    }
  });
});
module.exports = router;
