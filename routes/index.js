var express = require('express');
var router = express.Router();
var request = require('request');
var cheerio = require('cheerio');
var request = require('request');

var Ad = require("../models/ad");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/ejs', function(req, res, next) {
  res.render('adTemplate', {
     price: 17,
     header: "SAMSUNG S9, S9+...LO ULTIMO DE SAMSUNG AHORA EN CUBA...72067967,58181641. Manuel",
     body: "Test Body",
     email: "codegeek1991@gmail.com",
     name: "Manuel",
     phone: "54062652"
    });
});

router.get('/updater', function(req, res, next) {
  Ad.find({}, function(err,ads){
    console.log(ads);
    res.render('updater', {ads: ads});
  })
  
});

router.get('/iframer',function(req, res, next) {
  var url = req.query.url;
  var price = req.query.price;
  var header = req.query.header;
  var body = req.query.body;
  var email = req.query.email;
  var name = req.query.name;
  var phone = req.query.phone;
  var captchaid = req.query.captchaid
  //console.log(captchaid);
  res.render('adTemplateMozilla', {
    url: url,
    price: price,
    header: header,
    body: body,
    email: email,
    name: name,
    phone: phone,
    captchaid: captchaid
  });
});

router.get('/getme',function(req, res, next) {
  request('http://www.revolico.com/modificar-anuncio.html?key=MWBj68PmFqZc23261907', function(err, response, html) { 
    if(!err && response.statusCode == 200){
      var $ = cheerio.load(html);
      var adPrice = $('#price_edit').val();
      var adHeader = $('input[name="ad_headline"]').val();
      var adBody = $('#body').text();
      var adEmail = $('input[name="email"]').val();
      var adPersonaName = $('input[name="name"]').val();
      var adPersonaPhone = $('input[name="phone"]').val();
      var captcha = $('#captcha').prop('src');
      var captchaId = captcha.slice(captcha.indexOf('=')+1);
      console.log(adPersonaName);
      res.send(captchaId);
    }else{
      console.log(err)
    }
      //res.send(body);
  });
});

router.post('/postTest', function(req, res, next) {
  var uri = req.body.inputTest;
  //console.log(req.body.inputTest);
  Ad.findOne({uri: uri}, function(err, ad){
    if (err) { return next(err); }
    if (ad) {
      res.json({success: false, reason: 'ADALREADYEXIST'});
    }else{
      var options = {
        url: uri,
        agent: 'Mozilla/5.0'
      };
      request(options, function(err, response, html) { 
        if(!err && response.statusCode == 200){
          var $ = cheerio.load(html);
          var error = $('.errorText').text();
          if(error.includes('caducado')){
            res.json({success: false, reason: 'ADNOTEXIST'});
          }else{
            var $ = cheerio.load(html);
            var adPrice = $('#price_edit').val();
            var adHeader = $('input[name="ad_headline"]').val();
            var adBody = $('#body').text();
            var adEmail = $('input[name="email"]').val();
            var adPersonaName = $('input[name="name"]').val();
            var adPersonaPhone = $('input[name="phone"]').val();
            var captcha = $('#captcha').prop('src');
            var captchaId = captcha.slice(captcha.indexOf('=')+1);

            var newAd = new Ad({
              uri: uri,
              adPrice: adPrice,
              adHeader: adHeader,
              adBody: adBody,
              adEmail: adEmail,
              adPersonaName: adPersonaName,
              adPersonaPhone: adPersonaPhone,
              adCaptchaId: captchaId
          });
          newAd.save(function(){res.json({success: true});});
          }      
        }else{
          res.json({success: false});
          console.log(err)
        }
          //res.send(body);
      });
    }
  });


  

  //res.json({success: true});
});

module.exports = router;
