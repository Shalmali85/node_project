const Express = require('express');
const app=Express();

const path = require('path')
const bodyParser = require('body-parser');
const multer =require('multer');
const cors = require('cors');
const Repositories= require('./repositories/repositories.js');
const repo=  new Repositories();
const Notification= require('./notification');
const notification = new Notification();
const storage = multer.diskStorage({
    destination: function (req, file, cb) { cb(null, './tmp')},
    filename: function (req, file, cb) { cb(null, file.fieldname + '-' + Date.now()+ '-' + file.originalname);}
});
// Create the multer instance here
const upload = multer({ storage: storage, limits: { fileSize: 10 * 1024 * 1024}});



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())

app.use(Express.static('././static'));
app.use(upload.array('file'));
app.get('/test',(req,res)=>{
   res.send('testing');
});



app.get('/notify/all',(req,res)=>{
    const map= new Map();
    let subscriber=[];
    const data="Service would be upgraded today"
    repo.getAllSubscriptions().then(data=> {
        if(res) {
            subscriber=data;
            return subscriber;
        }
    }).then(subscriber=>
        notification.pushNotifier(subscriber, data)).then(status => {
            console.log("success"+status);
        res.send("Notification sent");
    }).catch((err) => {
            console.log("error"+err);
            res.status(500).send(err.message);
        });
});

app.post('/subscribe',(req, res)=> {
    let endpoint = req.body['notificationEndPoint'];
    let publicKey = req.body['publicKey'];
    let auth = req.body['auth'];
    let user = req.body['user'];
    let time = Date.now();
    if(!req.body['notificationEndPoint'] ||!req.body['publicKey'] || !req.body['auth'] || !req.body['user'])
    {
        return res.status('400').send('Bad Request either notificationEndPoint or user or auth or publicKey  missing');

    }
    const data ={endpoint: endpoint,
        keys: {
            p256dh: publicKey,
            auth: auth
        },count:0,user:user,time:time};
    repo.insertSubscription(data,(err,resp)=>{
        if(resp){
            res.send('Subscription accepted!');
        }
        else {
            res.status('500').send(err.message);
        }
    });

});
app.post('/unsubscribe', (req, res)=> {
    let endpoint = req.body['notificationEndPoint'];
    if(!req.body['notificationEndPoint'])
    {
        return    res.status('400').send('Bad Request');

    }
    const data ={endpoint:endpoint};
    repo.deleteSubscription(data,(err,resp)=>{
        if(resp){
            res.send('Subscription deleted!');
        }
        else {
            res.status('500').send(err.message);
        }
    });

});
app.post('/notify',(req,res)=>{
    if(!req.headers['user'])
    {
        return res.status('400').send('Bad Request');
    }
    var incidentNo='SNI00'
    var val = Math.floor(1000 + Math.random() * 9000);
    incidentNo=incidentNo+val;
    let data= ` Attachment with id ${incidentNo}is uploaded to backend system`;
    let subscriber=[];
    let datum='';
    repo.getSubscription(req.headers['user']).then(resp=> {
        if(resp && resp.length > 0) {
            datum= resp[0];
            if(datum && datum.count >= 1){
               let counter = parseInt(datum.count)+1;
               data= 'You have '+ counter+' new notification'
            }

            subscriber=resp;
            return subscriber;
        }
    }).then(subscriber=>
        notification.pushNotifier(subscriber, data)).then(status => {
            console.log("success"+status);
            return status;
     }).then(status=>{
         if(status && status === '201'){
             datum.count= datum.count+1;
             repo.updateSubscriptionCount(datum).then(res =>{

             })
             return res.send({incidentNo: incidentNo});
         }
    }) .catch((err) => {
            console.log("error"+err);
            res.status(500).send(err.message);
        });
});
app.post('/notify/reset',(data,res)=>{
    if(data.body.user){
        repo.getSubscription(data.body.user).then(data=> {
            if(res) {
                subscriber=data[0];
                return subscriber;
            }
        }).then(subscriber=> {
            subscriber.count= 0;
                repo.updateSubscriptionCount(subscriber).then(resp =>{
                    if(resp) {
                        res.send({read: true});
                    }

                })
        }) .catch((err) => {
            console.log("error"+err);
            res.status(500).send(err.message);
        });
    }
})
module.exports = app;


