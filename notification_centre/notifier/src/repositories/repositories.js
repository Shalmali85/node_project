/**
 * Created by SH361944 on 8/1/2017.
 */
const mongoClient = require('mongodb').MongoClient;
const _=require('lodash')
const connection = require('./connection');
const moment = require('moment');
function repo(){
    ;
}
repo.prototype.getEmployee = function(callback) {
      console.log("inside function");

      mongoClient.connect(connection,function (err, db) {
       if(err) {
           callback(err,null);
           return;
       }
         console.log("connection established");
       db.collection("employee").find({}).toArray(function(error, result) {
             if (error) throw error;
             db.close();
             console.log(result);
           const data = _.map(_.groupBy(result, res =>
               res.department), (value, key) => {
               const userList = [];
               value.forEach((item) => {
                   userList.push(item.name);
               });
               return { department: key, users: userList };
           });
           callback(error,{data:data});
         });

     });
 };
repo.prototype.insertSubscription=function (data,callback) {
    console.log("inside function");

    mongoClient.connect(connection, function (err, db) {
        console.log("connection established");
        if(db) {
            db.collection("notification").findOne({endpoint: data.endpoint}, function (error, result) {
                if (error) {
                    callback(error);
                }
                if (!result) {
                    db.collection("notification").insertOne(data, function (err, res) {
                        if (err) {
                            callback(err);
                        }
                        console.log("1 document inserted");
                        db.close();

                    });
                }

            });
        }
        else{
            callback(new Error('Connection Refused'))
        }

    })
}
repo.prototype.updateSubscriptionCount=function (data) {
    console.log("inside function");

     return new Promise(function(resolve,reject){(mongoClient.connect(connection, function (err, db) {
         if(db) {
             db.collection("notification").findOneAndUpdate(
                 {endpoint: data.endpoint},
                 {endpoint: data.endpoint, keys: data.keys, user: data.user, count: data.count, time: Date.now()},
                 function (err, doc) {
                     if (doc) {
                         console.log("updated");
                         db.close();
                         resolve(true);
                     }
                     else{
                         reject(err);
                     }
                 }
             )
         }
         else{
             reject(new Error('Connection refused'));
         }
    }));
   });

}
repo.prototype.deleteSubscription=function (data,callback) {
    console.log("inside function");

    mongoClient.connect(connection, function (err, db) {
        console.log("connection established");
        if(db) {
            db.collection("notification").findOne({endpoint: data.endpoint}, function (error, result) {
                if (error) {
                    callback(error);
                }
                if (result) {
                    db.collection("notification").deleteOne(data, function (err, res) {
                        if (err) {
                            err;
                            callback(err);
                        }
                        console.log("1 document deleted");
                        db.close();
                    });
                }

            });
        }
        else{
            callback(new Error('Connection Refused'));
        }
    })
}

repo.prototype.getSubscription=function(args) {

    return new Promise(function(resolve,reject){(mongoClient.connect(connection,function (err, db) {
        if(db) {
            if (err) {
                reject(err);
                return;
            }
            db.collection("notification").find({user: args}).sort({time: -1}).limit(1).toArray(function (error, res) {
                if (error) {
                    reject(error)
                };
                console.log("Fetched user");
                db.close();
                resolve(res);
            });
        }
        else{
            reject(new Error('Connection Refused'))
        }
    }))
    });

};
repo.prototype.getAllSubscriptions=function() {


    return new Promise(function(resolve,reject){(mongoClient.connect(connection,function (err, db) {
        if(db) {
            if (err) {
                reject(err);
                return;
            }
            db.collection("notification").find({}).toArray(function (error, result) {
                if (error) {
                    reject(error);
                }
                db.close();
                resolve(result);
            });
        }
        else{
            reject(new Error('Connection Refused'));
        }
    }))
    });

};
module.exports= repo;


