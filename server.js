const mongoose = require('mongoose');
const express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');
const User = require('./api/users');
const Food = require('./api/food');
const Data = require('./api/data');
const API_PORT = 3000;
const app = express();
app.use(cors());
const router = express.Router();
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa')

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://abellinii.au.auth0.com/.well-known/jwks.json`
  }),

  // Validate the audience and the issuer.
  audience: 'K0mowQGaScTM4gThu3hNiYFrv1mlKzd0',
  issuer: `abellinii.au.auth0.com`,
  algorithms: ['RS256']
});

// this is our MongoDB database
const dbRoute = 'mongodb://wadeabel:Helloworld1@ds125293.mlab.com:25293/mydatabase';

// connects our back end code with the database
mongoose.connect(
  dbRoute,
  { useNewUrlParser: true }
);

let db = mongoose.connection;

db.once('open', () => console.log('connected to the database'));

// checks if connection with the database is successful
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));

// this is our get method
// this method fetches all available data in our database
router.get('/getData', (req, res) => {
   


  Data.find((err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });


});






//-----------------------------------------User info----------------------------------------------------






//get user data
router.get('/getUserinfo/:user',(req,res)=>{
 console.log("getUser")

  User.findOne({_id:req.params.user},(err, data) => {

    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });



})

//working on this-------------------->>>>>>>>>>>>>>>>>>>>>>>>>


//Get weeks meal plan
router.get('/getWeekMeal/:week',(req,res)=>{
  User.findOne({"weeks.weekID":req.params.week},{_id:0,"weeks.weeksRecipes.$":1}, (err, data) => {
    
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
})


///add a user
router.put('/putUserData', (req, res) => {

  let user =req.body.user; 
    console.log(req.body.user)
 User.create(user,(err,data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});


//add week to user
router.post('/addWeekToUser', (req, res) => {
  const { id, update } = req.body;
console.log(JSON.stringify(update))
User.updateOne({_id:id}, {$push: {weeks:update}},(err) => {

    if (err) return res.json({ success: false, error: err });
    
    return res.json({ success: true });
  });
});


//Add recipe to week
router.post('/addRecipeToWeek', (req, res) => {
  const { week, id, day, meal, recipe } = req.body;
var query = {};
query['weeks.$.weeksRecipes.' + day + '.' + meal] = recipe;
User.updateOne({_id:id,'weeks.weekID':week}, {$set: query},(err) => {
 console.log(id);
 console.log(week);
 console.log(query)
    if (err) return res.json({ success: false, error: err });
    
    return res.json({ success: true });
  });
});


//add food to foods/User
router.post('/addUnknownItemToFoods', (req, res) => {
const {id,update,category}= req.body

var query = {};
query[category] = update;
User.updateOne({_id:id}, {$push: query}, err => {

    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

//remove a given item from user
router.post('/removefromUser', (req, res) => {
	const {id,update,category}= req.body
	var query = {};
query[category] = update;

User.updateOne({_id:id}, {$pull: query}, err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});



//-------------------------------------------------------------------------------------------------------------


//--------------------------------------General Food Data-------------------------------------------

//add food to foods/types of foods
router.post('/addUnknownItemToFoods/:foodItem', (req, res) => {

Data.updateOne({_id:1}, {$push: {food:req.params.foodItem}}, err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});


//---------------------------------------------------------------------------------------------------

//GetUserData
// router.get('/getFood', (req, res) => {
//   Data.find((err, data) => {
//     if (err) return res.json({ success: false, error: err });
//     return res.json({ success: true, data: data });
//   });
// });

// this is our update method
// this method overwrites existing data in our database
router.post('/updateData', (req, res) => {
  const { id, update } = req.body;
  Data.findOneAndUpdate(id, update, err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

// this is our delete method
// this method removes existing data in our database
router.delete('/deleteData', (req, res) => {
  const { id } = req.body;
  Data.findOneAndDelete(id, err => {
    if (err) return res.send(err);
    return res.json({ success: true });
  });
});

// this is our create methid
// this method adds new data in our database
router.post('/putData', (req, res) => {
  let data = new Data();

  const { id, message } = req.body;

  if ((!id && id !== 0) || !message) {
    return res.json({
      success: false,
      error: 'INVALID INPUTS'
    });
  }
  data.message = message;
  data.id = id;
  data.save(err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});



// append /api for our http requests
app.use('/api', router);

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
