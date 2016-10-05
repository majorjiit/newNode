var User = require('../models/user');

var config = require('../../config');
var secretKey = config.secretKey;
var jsonwebtoken = require('jsonwebtoken');

function createToken(user)
{
	var token = jsonwebtoken.sign({
		//_id:user._id,
		username:user.username,
		name:user.name
	},secretKey);
	return token;
}

module.exports = function(app,express){
	var api = express.Router();
	
	api.post('/signup',function(req,res){
		var user = new User({
			name : req.body.name, 
			username : req.body.username,
			password : req.body.password
		});
		
		res.json({message: " user has been created successfully"});
		/*
		user.save(function(err){
			if(err)
			{
				res.send(err);
				console.log("cannot create the user");
				return;
			}
			res.json({message:"user has been created"});
		});
		*/
		
	});
	
	api.get('/users',function(req,res){
		User.find({},function(err,users){
			if(err)
			{
				res.send(err);
				return;
			}
			res.send(users);
		});
	});
	
	api.post('login',function(req,res){
		User.findOne({
			username : req.body.username
		}).select('password').exec(function(err,user){
			if(err)
			{
				throw err;
			}
			if(!user)
			{
				res.send({message:"user doesnt exists"});
			}
			else if(user)
			{
				var validPass = User.comparePassword(req.body.password);
				if(!validPass)
				{
					res.send({message : "password is invalid"});
				}
				else{
					//creating token
					var token = createToken(user);
					
					res.send({
						success : true,
						message : "Successfully Logged in!!",
						token : token
					});
				}
			}
		});
	});
	api.post('/createToken',function(req,res){
		var token = createToken(new User({
			name: req.body.name,
			username: req.body.username,
			password : req.body.password
		}));
		
		res.send({
			success : true,
			messsage : "Successfully logged in!!",
			token : token
		});
	});
	
	api.use(function(req,res,next){
		console.log("somebody just came to our app");
		var token = req.body.token || req.param('token') || req.headers['x-access-token'];
		//check of token exists
		if(token)
		{
			jsonwebtoken.verify(token,secretKey,function(err,decoded){
				if(err){
					res.status(403).send({success: false,message : "Failed To Authenticate"});
				}
				else{
					req.decoded = decoded;
					next();
				}
			});
		}
		else{
			res.status(403).send({success:false,message:"No Token Provided"});
		}
	});
	
	api.get('/',function(req,res){
		res.json("Hello World !!");
	});
	
	
	return api;
}
