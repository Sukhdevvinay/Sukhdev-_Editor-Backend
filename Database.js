const mongoose = require('mongoose');
const mongourl = "mongodb+srv://Vinay:<db_password>@sukhdeveditordatabase.iqckrof.mongodb.net/?retryWrites=true&w=majority&appName=SukhdevEditorDatabase";

const connectmongodb = async () => {
    try {
        await mongoose.connect(mongourl);
        console.log("Connected to DBMS");
    } catch (error) {
        console.error("Failed to connect to DBMS:", error);
    }
};


module.exports = connectmongodb;
