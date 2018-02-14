let express = require('express');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');

let app = express();

// Setup middleware
app.use(express.static(__dirname + '/static'));
app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


// Connnect to the Database
mongoose.connect('mongodb://localhost/messageBoard');
// Overwrite mongoose promise library with the JS one
mongoose.Promise = global.Promise;

//Schemas
//Message Schemas
let MessageSchema = new mongoose.Schema({
	name: {
		type: String, 
		required: [true, 'Name cannot be blank'],
		minlength: [4, 'Name must be at least four characters']
	},
	message: {
		type: String,
		required: [true, 'Message cannot be blank']
	},
	comments: [{
		type: mongoose.Schema.Types.ObjectId, 
		ref: 'Comment'}]
	
}, { timestamps: true });
//Comment Schema

let CommentSchema = new mongoose.Schema({
	name: {
		type: String, 
		required: [true, 'Name cannot be blank'],
		minlength: [4, 'Name must be at least four characters']
	},
	comment: {
		type: String,
		required: [true, 'Comment cannot be blank']
	},
	message: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Message'
    }
}, { timestamps: true });

let Message = mongoose.model('Message', MessageSchema);
let Comment = mongoose.model('Comment', CommentSchema);

//Routes

app.get('/', function(req, res){
	Message.find({}).populate('comments').exec(function(err, messages){
		if(err){
			console.log(err);
		} else{
			console.log(messages);
			return res.render('index.ejs', { messages: messages});
		}
	})
})

app.post('/messages', function(req, res){
	//console.log(req.body);
	Message.create(req.body, function(err, message){
		if(err){
			let errors_arr = [];
			for(key in err.errors){
				let error = err.errors[key];
				//console.log(error.message);
				errors_arr.push(error.message);
			}
			    
		}else {
			console.log(message);
		}
	})

	// let message = new Message(req.body);
	// message.save()
	// //message.name = req.body.message

	return res.redirect('/');
})

app.post('/comments', function(req, res){
	Comment.create(req.body, function(err, comment){
		if(err){
			console.log(err);
		} else {
		  Message.findByIdAndUpdate(req.body.message, { $push: {comments:comment._id} },{ new: true }, function(err, message){
		  	if(err) {
		  		console.log(message);
		  	}else {
		  		console.log(message);
		  		return res.redirect('/');
		  	}	
		   })
		  }
		})
       })
app.listen(8000, function(){
	console.log('Listening on port 8000...');
})


















