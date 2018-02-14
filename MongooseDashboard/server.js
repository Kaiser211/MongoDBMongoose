

var express = require("express");
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();
var path = require('path');
var session = require('express-session');
var port = 8000;

// DataBase Connecting

mongoose.connect('mongodb://localhost/mongoose_dashboard');
mongoose.Promise = global.Promise;

app.use(express.static(__dirname + '/static'));
app.use(bodyParser.urlencoded({ extended: true}));
app.set('views', __dirname+ "/views");
app.set('view engine', 'ejs');


let Rabbit = mongoose.model("Rabbit", new mongoose.Schema({
	name:{
		type:String, required:true, minlength:1, maxlength:255},
	age:{
		type:Number, required:true, minlength:1, max:100},
	carrots:{
		type:Number, required:true, minlength:0, max:50}
	}, {timestamps:true}));
	
app.get("/", function(req,res){
	Rabbit.find({}, function(err,rabbits){
		if(err){
			res.redirect("/");
		}else {
			res.render("index", {rabbits:rabbits});
		}
})
})	

app.get("/rabbits/new", function(req,res){
	res.render("rabbits_new");
})
app.post("/rabbits/new", function(req,res){
	let rabbit = new Rabbit({
		name:req.body.name,
		age:req.body.age,
		carrots:req.body.carrots
	})
	rabbit.save(function(errs){
		if(errs){
			res.render("rabbits_new", {errors:rabbit.errors});
		}else{
			res.redirect("/");
		}
	})
})

app.get("/rabbits/:id", function(req,res){
	let rabbit = Rabbit.find({_id: req.params.id}, function(err,rabbit){
		if(err){
			res.redirect("/rabbits/"+req.params.id);
		}else{
			res.render("rabbits_show", {rabbit:rabbit[0]});
		}

	})
})
app.get("/rabbits/edit/:id",function(req,res){
    let rabbit = Rabbit.find({_id:req.params.id},function(err,rabbit){
        if(err){
            res.redirect("/rabbits/"+req.params.id);
        }else{
            res.render("rabbits_update",{rabbit:rabbit[0]});
        }
    });
});
app.post("/rabbits/edit/:id",function(req,res){
    
    let rabbit = Rabbit.find({_id:req.params.id},function(err,rabbit){
        rabbit         = rabbit[0];
        rabbit.name    = req.body.name;
        rabbit.age     = req.body.age;
        rabbit.carrots = req.body.carrots;
        rabbit.save(function(errs){
            if(errs){
                res.render("rabbits_update",{rabbit:rabbit,errors:rabbit.errors});
            }else{
                res.redirect("/");
            }
        });
    });
});

app.get("/rabbits/destroy/:id",function(req,res){
    Rabbit.remove({_id:req.params.id},function(err){
        res.redirect("/");
    });
});


app.listen(port);
console.log("Listening port on 8000.........");











