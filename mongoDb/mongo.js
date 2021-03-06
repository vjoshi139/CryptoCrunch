// const db = require('./mongoDb/connectMongo');
const MongoClient = require('mongodb').MongoClient;
const config = require('config');
const assert = require('assert');
var db;
// Connection URL
const url = config.get('Db.url')

// Database Name
const dbName = config.get('Db.dbName');

function connect (callback) {
    MongoClient.connect(url, function (err, client) {
        assert.equal(null, err);
        console.log("Connected correctly to server");
        db = client.db(dbName);
        //const db = client.db(dbName);
        callback(db) ;
        // findAndDelete(db, function() {
        //     client.close();
        // });
    });
}

function find(collectionName, query,callback) {
  // const projection = options ? options : {}
        const collection = db.collection(collectionName);
        collection.find(query).toArray(function (err,data) {
           callback(err,data);
        })
}
function search(collectionName,query,filter,project,skip,limit,sort, callback) {
    var mongoQuery = {}
    var mongoFilter = {}
    var mongoProject ={}
    var mongoSkip=0;
    var mongoLimit=30;
    var mongoSort = {};
    if(query){
        mongoQuery = query
    }
    if(filter){
        mongoFilter = filter
    }
    if(project){
        mongoProject = project
    }
    if(skip){
        mongoSkip = parseInt(skip)
    }
    if(limit){
        mongoLimit = parseInt(limit)
    }
    if(sort){
        mongoSort = sort
    }
    const collection = db.collection(collectionName);
    collection.find(mongoQuery).filter(mongoFilter).project(mongoProject).sort(mongoSort).skip(mongoSkip).limit(mongoLimit).toArray(function (err,data) {
        callback(err,data);
    })
}

function findAndDelete(collectionName, query, callback) {
    const collection = db.collection(collectionName);
    collection.findAndDelete(query , function(err,data) {
       callback(err,data);
    })

}

function insertOne(collectionName, data, callback) {
    const collection = db.collection(collectionName);
    collection.insertOne(data , function(err,data) {

        const obj = new Object();
        if(!err){
        obj['result']= data.result,  
        obj['ops'] = data.ops;
        obj['insertedCount'] = data.insertedCount,
        obj['insertedId'] = data.insertedId
        }
        callback(err,obj);
    })
}

function insertMany(collectionName, data, callback) {
    const collection = db.collection(collectionName);
    collection.insertMany(data, function (err, data) {
        console.log(data,err, "insertMany-data");
       callback(err,data);
    })
}
function updateOne(collectionName,toUpdate, data, callback) {
    const collection = db.collection(collectionName);
    collection.updateOne(toUpdate, {$set: data}, function (err, data) {
        //console.log(data, "updateOne-data");
       callback(err,data.result);
    })
}

function updateMany(collectionName,toUpdate, data, callback) {
    const collection = db.collection(collectionName);
    collection.updateMany(toUpdate, {$set: data}, function (err, data) {
        console.log(data, "updateMany-data");
        callback(err,data);
    })
}



module.exports = {find,findAndDelete,insertOne,insertMany,updateOne,updateMany,connect,search}

