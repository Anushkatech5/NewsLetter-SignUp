// jshint esversion: 6

const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us22.api.mailchimp.com/3.0/lists/9c5f34d895";

    const options = {
        method: "POST",
        auth: "Anushka:43866663725a13c4a1de04e4818eba2a-us22"
    };

    const request = https.request(url, options, function(response) {
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data) {
            console.log(JSON.parse(data));
        });
    });

    request.on("error", function(e) {
        console.error(`Problem with request: ${e.message}`);
        res.send("There was an error with signing up, please try again!");
    });

    request.write(jsonData);
    request.end();
});


app.post("/failure", function(req,res){
    res.redirect("/");
})

app.listen(3000, function() {
    console.log("Server is running on port 3000.");
});

//API KEY
//43866663725a13c4a1de04e4818eba2a-us22

//List ID
//9c5f34d895
