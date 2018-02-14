// Require the Express Module
var express = require('express');
// Create an Express App
var app = express();
// Require body-parser (to receive post data from clients)
var bodyParser = require('body-parser');

// Require path
var path = require('path');

var mongoose = require('mongoose');

// Integrate body-parser with our App
app.use(bodyParser.urlencoded({ extended: true }));
// Setting our Static Folder Directory
app.use(express.static(path.join(__dirname, './static')));
// Setting our Views Folder Directory
app.set('views', path.join(__dirname, './views'));
// Setting our View Engine set to EJS
app.set('view engine', 'ejs');

// mongoose and other database stuff
 mongoose.connect('mongodb://localhost/quoting_Dojo');//{ useMongoClient: true }
 mongoose.Promise = global.Promise;

 // User Native promises
 var QuoteSchema = new mongoose.Schema({
   // name: String,
   // quote: String
   name: {
        type: String,
        required: [true, 'Name cannot be blank'],
        minlength: [2, 'Name must be greater than 2 characters'],
   },
   quote: {
        type: String,
        required: [true, 'Quote cannot be blank'],
        minlength: [2, 'Quote must be greater than 10 characters']
   }

 } , {timestamps: true});
 // register a model by passing in a schema
 mongoose.model('Quote', QuoteSchema);
 // extract a model by omitting the schema
 // this must happen after you register a model
 var Quote = mongoose.model('Quote')
// Routes
// Root Request
app.get('/', function(req, res) {
    // This is where we will retrieve the users from the database and include them in the view page we will be rendering.
    res.render('index');
})
app.get('/show', (req, res)=>{
  Quote.find({}, (err, results)=>{
    if(err){ 
      console.log(err); }
    else {
    res.render('quotes', { quotes: results});
  }
  })
});
// Add User Requests 
app.post('/users', function(req, res) {
    console.log("POST DATA", req.body);
    // This is where we would add the user from req.body to the database.
    var quote = new Quote(
      {name: req.body.name, quote: req.body.quote});
     quote.save(function(err){
    if(err){
       console.log('Something Went Wrong');
      //res.render('index', {errors: quote.errors})
    }else {
       console.log('Successfully added Quote');
      return res.redirect('/show')
    }
  })
});
// Setting our Server to Listen on Port: 8000
app.listen(8000, function() {
    console.log("listening on port 8000");
})
