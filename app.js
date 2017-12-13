var fs = require('fs');
var express = require('express');
var app = express();
var path = require("path");
var http = require('http');
var dir = './public/arcadeFonts/8x8';
var Handlebars = require('express-handlebars');

app.use(express.static('./public'));
app.engine('.hbs', Handlebars({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.get('/',function(req,res){
  res.render(path.join(__dirname+'/index.hbs'),  {fonts : getFileSelection(dir), spritesheets : getFileNames(dir)});
});
app.listen(8080);
console.log("Server running at http://127.0.0.1:8080/");

var getFileNames = function(dir, files_){
    files_ = files_ || [];
    var files = fs.readdirSync(dir);
    for (var i in files){
        var name = dir + '/' + files[i];
        if (fs.statSync(name).isDirectory()){
            getFileNames(name, files_);
        } else {
        	name = files[i].substr(0, files[i].length-4);
            files_.push(name);
        }
    }
    return files_;
};

var getFileSelection = function(dir, files_){
    files_ = files_ || [];
    var files = fs.readdirSync(dir);
    for (var i in files){
        var name = dir + '/' + files[i];
        if (fs.statSync(name).isDirectory()){
            getFileSelection(name, files_);
        } else {
        	name = files[i].substr(0, files[i].length-4);
        	if (name == 'Ninja Gaiden (Tecmo)') {
        		files_.push("<option selected=\"selected\">" + name + "</option>");
        	} else {
            files_.push("<option>" + name + "</option>");
        	}
        }
    }
    return files_;
};