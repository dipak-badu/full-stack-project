const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initData = require("./data.js");

const MONGO_URL = `mongodb://127.0.0.1:27017/wanderlust`;

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    await Listing.deleteMany({});
   initData.data = initData.data.map((obj)=>({
    ...obj , 
    owner: "67bc5944474be91f1c6a0261"}))
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
};

main()
    .then(() => {
        console.log("Connected to DB!!");
        return initDB(); // Ensure initDB runs only after connection
    })
    .then(() => {
        console.log("Database initialized successfully");
    })
    .catch((error) => {
        console.error("Failed to connect to the database or initialize data:", error);
    });
