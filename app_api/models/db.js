const mongoose = require('mongoose');
const config = require('config')
//const dbURI = "mongodb://localhost/agents";
//const dbURI = 
mongoose.connect(config.dbHost,{useNewUrlParser: true})
mongoose.connection.on('connected',()=>{console.log(`Mongoose connected to ${config.dbHost}`)});
mongoose.connection.on('error',err=>{console.log(`Mongoose connection error:${err}`)});


const gracefulShutdown = (msg, callback)=>{
    mongoose.connection.close( ()=> {
        console.log(`Mongoose disconnected via ${msg}`);
        callback();
    })
}

process.once('SIGUSR2', ()=> {
    gracefulShutdown('nodemon restart',()=> {
        process.kill(process.pid,'SIGUSR2');
    });
});

process.once('SIGINT', ()=> {
    gracefulShutdown('App Termination',()=> {
        process.exit(0);
    });
});

process.once('SIGTERM', ()=> {
    gracefulShutdown('Heroku app shutdown',()=> {
        process.exit(0);
    });
});