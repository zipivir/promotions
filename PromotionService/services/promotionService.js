const { PromotionSchema, PromotionTypes, userGroups } = require('../schema/promotion');
const databaseConfig = require('../config/database');
const MongoClient = require('mongodb').MongoClient;
const fs = require('fs');
const moment = require('moment');

let dbo;
const defaultLimit = 100;

MongoClient.connect(databaseConfig.url, function(err, db) {
    if (err) throw err;
    dbo = db.db(databaseConfig.dbname);
  });

const getRandomInt = (max) => {
   return Math.floor(Math.random() * Math.floor(max));
}

exports.saveSchema = async (schemaObj) => {
    let data;
    let errorMessage;
    //// example for schemaObj: {"schema": {"table":"promotions", "schema": {"name":"string","promotionType":"string","startDate":"date","endDate":"date","userGroupName":"string"}}}
    
    try {
        data = await dbo.collection("schema").insertOne(schemaObj);
        console.log('data: ', data);
    } catch (err) {
        console.log('err', err);
        errorMessage = err;
    }
    return ({
        success: data ? 200 : 500,
        errorMessage: errorMessage || null,
        data: schemaObj,
    });
}

exports.getPromotionSchema = async () => {
    let promotionSchema;
    let errorMessage;
    try {
        promotionSchema = await dbo.collection("schema").findOne({ table: 'promotions' });
    } catch (err) {
        console.log('err', err);
        errorMessage = err;
    }
    return {
        status: promotionSchema ? 200 : 500,
        errorMessage: errorMessage || null,
        schema: promotionSchema && promotionSchema.schema,
    };
}
///////////////////////////////////////////////////

exports.getPromotions = async (query) => {
    let { limit = defaultLimit, offset = 0 } = query;
    limit = parseInt(limit);
    offset = parseInt(offset);
    let promotionsData;
    let promotionsTotal;
    let promotionSchema;
    let errorMessage;
    try {
        promotionsTotal = await dbo.collection("promotions").count();
        promotionsData = await dbo.collection("promotions").find(query.filterBy).sort({name: 1}).skip(offset).limit(limit).toArray();
        promotionSchema = await this.getPromotionSchema()
        console.log('promotionSchema', promotionSchema);
    } catch (err) {
        console.log('err', err);
        errorMessage = err;
    }
    return {
        status: promotionsData ? 200 : 500,
        errorMessage: errorMessage || null,
        total: promotionsTotal,
        data: promotionsData,
        schema: promotionSchema.schema || PromotionSchema,
    };
}

exports.savePromotion = async (promotion) => {
    let promotionData;
    let errorMessage;
    try {
        promotionData = await dbo.collection("promotions").insertOne(promotion); //, function(err, res) {
        //    if (err) throw err;
        //    console.log("1 document inserted: " + res.insertedCount);
        //});
        console.log('data: ', promotionData);
    } catch (err) {
        console.log('err', err);
        errorMessage = err;
    }
    return ({
        success: promotionData ? 200 : 500,
        errorMessage: errorMessage || null,
        data: promotionData && promotionData.ops,
    });
}

exports.updatePromotion = async (id, promotion) => {
    let promotionData;
    let errorMessage;
    try {
        const query = { _id: id };
        promotionData = await dbo.collection("promotions").updateOne(query, promotion); //, function(err, res) {
        //     if (err) throw err;
        //     console.log("1 document updated: " + res);
        //     promotionsData = res;
        // });
    } catch (err) {
        console.log('err', err);
        errorMessage = err;
    }
    console.log('pppppppp', id, promotion)
    return ({
        success: promotionData ? 200 : 500,
        errorMessage: errorMessage || null,
        data: promotion,
    });
}

exports.deletePromotion = async (id) => {
    let promotionData;
    let errorMessage;
    try {
        const query = { _id: id };
        promotionsData = await dbo.collection("promotions").deleteOne(query); //, function(err, res) {
        //     if (err) throw err;
        //     console.log("1 document deleted: " + res);
        // });
        console.log("1 document deleted");
        console.log('data: ', promotionData);
    } catch (err) {
        console.log('err', err);
        errorMessage = err;
    }
    return ({
        success: promotionData ? 200 : 500,
        errorMessage: errorMessage || null,
        data: promotionData,
    });
}

/// generate random promotions data and save it on db
exports.generatePromotions = async (lastId, size) => {
    const promotionsList = {};
        promotionsList.table = [];
    let errorMessage;
    let promotionSchema;
    const now = Date.now();
    
    try {
        for (i=0; i < size ; i++) {
            var obj = { name: `promotion_${lastId+i}`, 
                promotionType: PromotionTypes[getRandomInt(3)], 
                startDate: moment(now).format('YYYY-MM-DD'), 
                endDate: moment(now).add(1, 'days').format('YYYY-MM-DD'),
                userGroupName: userGroups[getRandomInt(10)] }
            promotionsList.table.push(obj);
        }

        await dbo.collection("promotions").insertMany(promotionsList.table, function(err, res) {
            if (err) throw err;
            console.log("Number of documents inserted: " + res.insertedCount);
        });

        promotionSchema = await this.getPromotionSchema()

        await fs.writeFile ("promotions.json", JSON.stringify(promotionsList), function(err) {
            if (err) throw err;
            console.log('complete');
        });
        
    } catch (err) {
        console.log('err', err);
        errorMessage = err;
    }

    const promotionsTotal = await dbo.collection("promotions").count();
    console.log('total', promotionsTotal);

    return ({
        success: promotionsList ? 200 : 500,
        errorMessage: errorMessage || null,
        total: promotionsTotal,
        data: promotionsList.table.slice(0,50),
        schema: promotionSchema.schema || PromotionSchema,
    });
}
