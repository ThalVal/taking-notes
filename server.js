const express = require("express");

const PORT = process.env.PORT || 3001;
const app = express();

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const allRoutes = require("./routes");

app.use(allRoutes)


app.listen(PORT,()=>{
    console.log("listening on port " + PORT)
})