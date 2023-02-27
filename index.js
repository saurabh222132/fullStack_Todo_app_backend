const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const app = express();

const port = process.env.port || 30001;
const user = process.env.user;
const password = process.env.pass;

mongoose.set("strictQuery", true); // This line is added to remove DeprecationWarning
//connecting to database
const main = async () => {
  await mongoose.connect(
    `mongodb+srv://${user}:${password}@cluster1.bdobp9b.mongodb.net/?retryWrites=true&w=majority/test`
  );
};
main();

//creating schema

const todoSchema = mongoose.Schema({
  todo: String,
});

// creating model
const Todo = mongoose.model("todoList", todoSchema);

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

// post request:  recieving the post request from the client side to store the todo in database
app.post("/", (req, res) => {
  //create new todo to save in database
  const newTodo = new Todo({
    todo: req.body.todo,
  });
  newTodo
    .save()
    .then(() => console.log("newTodo saved in database successfully!"));
});

// onload request : send the stored taks to the client
app.get(`/onload`, (req, res) => {
  Todo.find({}, (err, result) => {
    if (err) console.log(err);
    const previouslyStoredData = result.map((data) => {
      return data.todo;
    });

    res.send(previouslyStoredData);
  });
});
// delete the toto
app.post(`/delete`, (req, res) => {
  Todo.deleteOne({ todo: req.body.forDeletetodo }, (err, result) => {
    console.log("todo deleted from database successfully!");
  });

  res.send("todo deleted");
});

app.listen(port, () => {
  console.log(`server is hosted on ${port} port!`);
});
