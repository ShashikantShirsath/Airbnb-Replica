const mongoose = require('mongoose');
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(() => {
        console.log("connected to db");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
};

const initDB = async () => {
    await Listing.deleteMany({});      //if something already inserted then delete all, then excute below
    initData.data = initData.data.map((obj) => ({...obj, owner: "67b4bcdaa91e342bef94c062"}));  //adding owner attribute
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
};

initDB();