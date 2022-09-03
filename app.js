const express = require("express");
const bodyparser = require("body-parser");
const request = require("request");
const https = require("https");
const { options } = require("request");

const app = express();

app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/", (req,res) => {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req,res) =>{
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {
        members:[
            {
                email_address : email,
                status : "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us10.api.mailchimp.com/3.0/lists/25b1e86385";

    const options ={
        method : "POST",
        auth: "wajid:03d0aafcfc62f13f7b5f764f3d482f03-us10"
    }

    const request = https.request(url, options, (response) => {

        if (response.statusCode === 200){
            res.sendFile(__dirname + "/success.html");
        }
        else{
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();
});

app.post("/failure", function(req, res){
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running on port 3000.");
});

//03d0aafcfc62f13f7b5f764f3d482f03-us10
// 25b1e86385