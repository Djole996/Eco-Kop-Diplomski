const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const mailchimp = require("@mailchimp/mailchimp_marketing");
const { response } = require("express");

const app = express();

app.use(express.static("css"));

app.use(bodyParser.urlencoded({ extended: true }));

mailchimp.setConfig({
  apiKey: "d38e7f9733e22ed60e3531de5044967c-us17",
  server: "us17",
});

async function getInformations() {
  const response = await mailchimp.lists.getList("7a6ae0fc80");
  console.log(response);
}

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", (req, res) => {
  const firstName = req.body.ime;
  const lastName = req.body.prezime;
  const email = req.body.email;
  const firstDay = req.body.prijava;
  const lastDay = req.body.odjava;
  const persons = req.body.brojOsoba;
  const phone = req.body.brojTelefona;

  const addMembers = async () => {
    const response = await mailchimp.lists.addListMember("7a6ae0fc80", {
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName,
        MMERGE6: firstDay,
        MMERGE7: lastDay,
        MMERGE8: persons,
        MMERGE9: phone,
      },
    });
  };

  addMembers();

  if (response.statusCode == 200) {
    if (
      firstName &&
      lastName &&
      email &&
      firstDay &&
      lastDay &&
      persons &&
      phone
    ) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
  }
});

app.post("/success", (req, res) => {
  res.redirect("/");
});
app.post("/failure", (req, res) => {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("server is running at port 3000");
});

//getInformations();
