
var mongoLabUrl=null;


 if(process.env.VCAP_SERVICES){
     var vcap_services = JSON.parse(process.env.VCAP_SERVICES);
     mongoLabUrl = vcap_services['user-provided'][0].credentials.uri;
     console.log("mongoUrl Vcaps---"+mongoLabUrl);
 }
else{
     mongoLabUrl = 'mongodb://localhost:27017/randev';
}

module.exports=mongoLabUrl;
