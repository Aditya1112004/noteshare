const mongoose = require("mongoose");

mongoose
  .connect(
    // "mongodb+srv://Aak1112004:Aak1112004@cluster0.tft820e.mongodb.net/noteshare?retryWrites=true&w=majority",
    // "mongodb+srv://Aditya11:Aditya1112004@cluster0.78dtulr.mongodb.net/noteshare",
    "mongodb+srv://Aditya11:Aditya1112004@cluster0.78dtulr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex:true
    }
  )
  .then(() => {
    console.log(`connection successful`);
  })
  .catch((e) => {
    console.log(`No connection`);
  });
