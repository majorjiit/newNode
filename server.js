var express = require('express');
var bodyParser= require('body-parser');
var morgan = require('morgan');
var config = require('./config');
var mongoose = require('mongoose');
var app = express();
/*
mongoose.connect(config.database,function(err){
	if(err)
	{
		console.log(err);
	}
	else{
		console.log("connected to database");
	}
});
*/
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(morgan('dev'));

app.use(express.static(__dirname + "/public"));

var api = require('./app/routes/api')(app,express);
app.use('/api',api);

app.get('*' , function(req,res){
	res.sendFile(__dirname + '/public/app/views/index.html');
});

app.listen(3001,function(err){
	if(err)
	{
		console.log("there is an error");
	}
	else{
		console.log("the app runs successfully on port 3001");
	}
});