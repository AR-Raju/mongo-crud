const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const objectId = require("mongodb").ObjectID;

const password = "xoVyVrlhK5l23tBe";

const uri = `mongodb+srv://dbUser:xoVyVrlhK5l23tBe@cluster0.crnhf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const app = express();
app.use(require("body-parser").json());
app.use(require("body-parser").urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

client.connect((err) => {
  const collection = client.db("myFirstDatabase").collection("products");
  // perform actions on the collection object
  // get from database
  app.get("/products", (req, res) => {
    collection.find({}).toArray((err, document) => {
      res.send(document);
    });
  });

  // update single product
  app.get("/product/:id", (req, res) => {
    collection
      .find({ _id: objectId(req.params.id) })
      .toArray((err, document) => {
        res.send(document[0]);
      });
  });

  // post to database
  app.post("/addProduct", (req, res) => {
    const product = req.body;
    collection.insertOne(product).then((result) => {
      console.log("one product added");
      res.redirect("/");
    });
  });

  // update in database
  app.patch("/update/:id", (req, res) => {
    collection
      .updateOne(
        { _id: objectId(req.params.id) },
        {
          $set: { price: req.body.price, quantity: req.body.quantity },
        }
      )
      .then((result) => {
        res.send(result.modifiedCount > 0);
      });
  });

  // delete from database
  app.delete("/delete/:id", (req, res) => {
    collection.deleteOne({ _id: objectId(req.params.id) }).then((result) => {
      res.send(result.deletedCount > 0);
    });
  });

  console.log("database connected");
});

app.listen(3000);
