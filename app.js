
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const socketIO = require("socket.io");

const path = require("path");
var bodyParser = require("body-parser");
const app = express();
const server = require("http").Server(app);
const io = socketIO(server);


require("dotenv").config();
app.options("*", cors());
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:4200"],
  })
);




app.use(bodyParser.json())
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, "uploads")));

const userRouter = require("./routes/userRoute");
const adminRouter = require("./routes/adminRoute");
const staffRouter = require("./routes/staffRoute");
const port = process.env.PORT || 3500;

app.use("/", userRouter);
app.use("/admin", adminRouter);
app.use("/staff", staffRouter);


mongoose.connect("mongodb://127.0.0.1:27017/bambino");



mongoose.connection.on("connected", () => {
  console.log("connected to mongo db");
});



app.listen(port, () => {
  console.log("listening on port 3500");
});

