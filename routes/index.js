var express = require('express');
var router = express.Router();
var Products = require('../models/product');
var Csurf = require('csurf');
var session = require('express-session');
var passport =require('passport');
/* GET home page. */

var csrfProtection = Csurf();
router.use(csrfProtection);
router.get('/', function(req, res, next) {
 Products.find(function(err,docs){
   var productChunks =[];
   var chunkSize=3;
   for(var i=0; i<docs.length;i+=chunkSize){
     productChunks.push(docs.slice(i,i+chunkSize));
   }
     res.render('shop/index', { title: 'shopping cart' , products:productChunks});
 });

});

/*router.get('/flash/signup',function(req,res,next){
  //var message = req.flash('message');
  var message =req.flash('info');
  console.log('from flash info'+message);
  console.log('flash message'+ message);
  res.render('user/signup',{csrfToken:req.csrfToken(), message: message,hasErrors:message.length > 0});

  //console.log('sign up page');
});*/
router.get('/signup', function (req, res, next) {
    var messages = req.flash('error');
    res.render('user/signup', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

router.post('/signup', passport.authenticate('local.signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
}));
/*router.post('/flash/signup',passport.authenticate('local.signup',{
  successRedirect:'/profile',
  failureRedirect:'/flash/signup',
  failureFalsh:true
}));*/
router.get('/profile',Loggedin(req,res,next),function(req,res,next){
  res.render('user/profile');
});

router.get('/signin',function(req,res,next){
   var messages = req.flash('error');
  res.render('user/signin',{csrfToken:req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

router.get('/logout',function(req,res,next){
  req.logout();
  res.redirect('/signin');
});

router.post('/signin',passport.authenticate('local.signin',{
  successRedirect:'/profile',
  failureRedirect:'/signin',
  failureFlash:true

}));
module.exports = router;
function Loggedin(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }else{
    res.redirect('/');
  }

}
