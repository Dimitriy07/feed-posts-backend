const path = require("path");

const { v4: uuidv4 } = require("uuid");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const { graphqlHTTP } = require("express-graphql");

const graphqlSchema = require("./graphql/schema");
const graphqlResolver = require("./graphql/resolvers");
const auth = require("./middleware/auth");
const { clearImage } = require("./util/file");

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    const fileExt =
      "." + file.mimetype.substring(file.mimetype.indexOf("/") + 1);
    cb(null, uuidv4() + fileExt);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
// Add mongoDB connection in the variable ex."mongodb+srv://{userName}:{password}@cluster0.zag3w.mongodb.net/messages?retryWrites=true&w=majority&appName=Cluster0"
const mongodbConnection = "";
// app.use(bodyParser, urlencoded());// x-www-form-urlencoded <form>

app.use(bodyParser.json());
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
app.use("/images", express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // as front end send OPTIONS method for log in graphql can't recognise this and throw an error. to avoid it we need to explicitly send status
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.use(auth);

app.put("/post-image", (req, res, next) => {
  if (!req.isAuth) {
    throw new Error("Not authenticated!");
  }
  if (!req.file) {
    return res.status(200).json({ message: "No file provided!" });
  }
  if (req.body.oldPath) {
    clearImage(req.body.oldPath);
  }
  return res
    .status(201)
    .json({ message: "File stored.", filePath: req.file.path });
});

// this middleware is activated in every request and set isAuth variable in true or false and after in resolvers I can decide if I need isAuth as a true or not

// app.use("/graphql", (req, res, next) => {
//   console.log("Request Headers:", req.headers); // Log headers
//   console.log("Request Body:", req.body); // Log body (the GraphQL query/mutation)

//   next(); // Continue to the actual GraphQL resolver
// });

app.use(
  // the root has to be "graphql" for convention
  "/graphql",
  graphqlHTTP({
    schema: graphqlSchema, // it uses for our defined in schema.js schema
    rootValue: graphqlResolver, // it uses for our defined in resolvers.js file
    graphiql: true, // Enables GraphiQL UI for testing
    formatError(err) {
      // here we check if we don't have the original error such as technical error (for example missing character in my query here or anything like that)
      if (!err.originalError) {
        return err;
      }
      // and if we don't have the original error, then I can extract useful information from it. Original error will be set by express graphql when it detects an error thrown in your code(by you or 3rd party package).
      //And we can retreive error data from resolvers.js
      const data = err.originalError.data;
      const message = err.message || "An error occurred";
      const code = err.originalError.code || 500;
      return { message: message, status: code, data: data };
    },
  })
);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(mongodbConnection)
  .then((result) => {
    app.listen(8080); // this is node server
  })
  .catch((err) => console.log(err));

// clearImage(filePath);
