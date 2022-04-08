const mongoose = require("mongoose");

if (process.env.NODE_ENV == "test") {
  var connectionString = process.env.MONGOOSE_CONNECTION_TEST;
} else if (process.env.NODE_ENV == "development") {
  var connectionString = process.env.MONGOOSE_CONNECTION_DEVELOPMENT;
} else if (process.env.NODE_ENV == "production") {
  var connectionString = process.env.MONGOOSE_CONNECTION;
}

// const mongooseConnection = mongoose.connect(connectionString)
//     .then(() => {
//         console.log(`Connected to MongoDB at ${connectionString}...`);
//     })
//     .catch((err) => {
//         console.error('Could not connect to MongoDB...', err);
//         mongooseConnection.disconnect();
//     });

const mongooseConnection = async function () {
  try {
    const connection = await mongoose.connect(connectionString);
    console.log(`Connected to MongoDB at ${connectionString}...`);
    return connection;
  } catch (err) {
    console.error("Could not connect to MongoDB...", err);
    mongoose.connection.close();
    connection.disconnect();
  }
};

module.exports = mongooseConnection;
