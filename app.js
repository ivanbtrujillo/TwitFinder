var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

/*Módulo para trabajar con la API de Twitter*/
var twitter =  require('ntwitter');

/*Rutas de express*/
var routes = require('./routes');
var users = require('./routes/user');

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

app.get('/', routes.index);
app.get('/users', users.list);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.render('error', {
        message: err.message,
        error: {}
    });
});

var termino = [''];


var nobuscar = false;
io.on('connection', function(socket){
    console.log('Usuario conectado');
    socket.on('disconnect', function(){
        console.log('Usuario desconectado');
    });

    socket.on('termino', function(msg){
        nobuscar = false;
        console.log('Buscar twits por: ' + msg);
        if(msg.length === 0 || !msg.trim()){
            console.log('NoBuscar')
            no_buscar= true;
        }else {
        termino[0]=msg;
        }
        if(nobuscar ==false){
            twit.stream('statuses/filter', {track: termino}, function (stream) { 
                socket.on('parar', function(msg){
                    setTimeout(stream.destroy, 1);
                });
                stream.on('data', function (data) {

                    console.log(termino);

                    io.emit('twit', data);
                });
            });
        }
    });

});

var twit = new twitter ({
    consumer_key: 'aMsIfcPchwmzUwsXt1VbX5E8c',
    consumer_secret: 'WmTvHaapUfQ8aQKb20TZGT5N6SEQBsGgzd0CxYH5luus2uo3j5',
    access_token_key: '1610314867-V4bss6qdwRsxm8a1spoMNVr9xgNProduOBkTHJA',
    access_token_secret: 'AlXvGJkAWhdKKQEFHQ5y2RiAy0PjfB8ZyXvfYhSi42Quv'
});





http.listen(3000, function(){
  console.log('listening on *:3000');
});

module.exports = app;
