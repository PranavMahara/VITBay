const mongoose = require("mongoose")

const connectionDB = () => {
    return mongoose.connect(process.env.connectionString, {
        useNewUrlParser: true, // UrlParser is something like it takes an input and it breaks it down into constituent parts to Protocol(https), Hostname(www.google.com), port(8080), query string, fragment identifier etc 
        // The parser can also validate the URL to ensure that it is well-formed and contains all the required components.
        useUnifiedTopology: true, // The useUnifiedTopology option removes support for several connection options that are no longer relevant with the new topology engine
    })
        .then((data) => {
            console.log(`Mongodb connected with server: ${data.connection.host}`);
        });
}

module.exports = connectionDB