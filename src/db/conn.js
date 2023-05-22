const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://Aak1112004:Aak1112004@cluster0.tft820e.mongodb.net/noteshare?retryWrites=true&w=majority",
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
