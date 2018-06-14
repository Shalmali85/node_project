const webPush= require('web-push');
const util = require('util');
const VAPID_SUBJECT = "mailto:shalmali.roy@tem.telstra.com";
const VAPID_PUBLIC_KEY = 'BJMCdnqsQsHqHgzf8JTEuQe854IbRBc-9HjXOrf8qCSvKcX4MvCoANRLpgm4Mtl73Nn7si4mp10Lpq2ftfK9jBw';//webPush.generateVAPIDKeys().publicKey;
const VAPID_PRIVATE_KEY = 'oOwRPpMcyC4Q2yw2ew3sOefMKlsBdT4R1Sjimo-nX58';//webPush.generateVAPIDKeys().privateKey;
const GCM_API_KEY="AIzaSyA-MbKlPgGHCFxA1iJzV-zr2mCQyrGoduA";
//Auth secret used to authentication notification requests.
const AUTH_SECRET = 'ZDg2NzQyMTpSaXlhMTk4NQ==';
if (!VAPID_SUBJECT) {
    return console.error('VAPID_SUBJECT environment variable not found.')
} else if (!VAPID_PUBLIC_KEY) {
    return console.error('VAPID_PUBLIC_KEY environment variable not found.')
} else if (!VAPID_PRIVATE_KEY) {
    return console.error('VAPID_PRIVATE_KEY environment variable not found.')
} else if (!AUTH_SECRET) {
    return console.error('AUTH_SECRET environment variable not found.')
}
webPush.setVapidDetails(
    VAPID_SUBJECT,
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY
);
function notification(){

}
notification.prototype.pushNotifier=function pushNotifier(subscribers,data){
    const title = `Notification received!`;
    return  new Promise((resolve,reject)=> {
        if(subscribers) {
            subscribers.forEach(pushSubscription => {
                const payload = JSON.stringify({message: data, title: title});
                webPush.sendNotification(pushSubscription, payload, {}).then((response) => {
                    console.log("Status : " + util.inspect(response.statusCode));
                    console.log("Headers : " + JSON.stringify(response.headers));
                    console.log("Body : " + JSON.stringify(response.body));
                    resolve(util.inspect(response.statusCode));
                }).catch((error) => {
                    console.log(error);
                    reject(error);
                });

            });
        }
        else {
            reject(new Error('Subscriber info missing'))
        }
    });



}
notification.prototype.testNotifier=function pushNotifier(subscribers,incidentNo){
    const message = incidentNo;
    const title = `Notification received!`;
    return  new Promise((resolve,reject)=> {
        subscribers.forEach(pushSubscription => {
            const payload = JSON.stringify({message: message, title: title});

        })
        resolve(201);
    });



}
module.exports=notification;