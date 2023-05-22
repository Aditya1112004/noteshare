const express = require("express");
const ejs = require("ejs");
const multer = require("multer");
const nodemailer = require("nodemailer");

const app = express();
const path = require("path");

// DB connection
require("./src/db/conn");
const register = require("./src/models/registers");
const assignments = require("./src/models/assigments");
const proedit = require("./src/models/edit");

//Port no
const port = process.env.PORT || 3001;

//Public Static Path

app.use("/css", express.static(path.resolve(__dirname, "assets/css")));
app.use("/js", express.static(path.resolve(__dirname, "assets/js")));
app.use("/images", express.static(path.resolve(__dirname, "assets/images")));

const partials_path = path.join(__dirname, "../views/partials");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set("view engine", "ejs");

// Files Upload
const StorageA = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "assets/uploads/assignments");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("_");
    cb(null, name + "-" + Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({
  storage: StorageA,
  limits: {
    fileSize: 1024 * 1024 * 10,
  },
});

//profile upload
const StorageB = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "assets/uploads/profiles");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("_");
    cb(null, name + "-" + Date.now() + path.extname(file.originalname));
  },
});
const upload2 = multer({
  storage: StorageB,
  limits: {
    fileSize: 1024 * 1024 * 10,
  },
});
// const profilePic = multer({
//   storage: StorageB,
//   limits: {
//     fileSize: 1024 * 1024 * 10,
//   },
//   fileFilter: function (req, file, cb) {
//     if (
//       file.mimetype == "profilePic/png" ||
//       file.mimetype == "profilePic/jpg" ||
//       file.mimetype == "profilePic/jpeg"
//     ) {
//       cb(null, true);
//     } else {
//       console.log("only jpg & png supported");
//       cb(null, false);
//     }
//   },
// });

// //image only
// fileFilter: function (req, file, cb) {
//   if (
//     file.mimetype == "notes/pdf"
//     || file.mimetype == "notes/jpg" ||
//     file.mimetype == "notes/jpeg"
//   ) {
//     cb(null, true);
//   } else {
//     console.log("only jpg & png supported");
//     cb(null, false);
//   }
// },
// const multipleUpload = upload.fields([
//   { name: "photo", maxCount: 1 },
//   { name: "sign", maxCount: 1 },
//   { name: "casteCerti", maxCount: 1 },
//   { name: "ssc", maxCount: 1 },
//   { name: "hsc", maxCount: 1 },
//   { name: "diploma", maxCount: 1 },
//   { name: "graduation", maxCount: 1 },
//   { name: "other", maxCount: 1 },
// ]);

//declaration
let user, fname, lname, userId;

// //Routing
app.get("/", (req, res) => {
  res.render("login");
});

//register Page`
app.get("/register", (req, res) => {
  res.render("register");
});

//register post
app.post("/register", async (req, res) => {
  try {
    const registerCandidates = new register({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: req.body.password,
      cpassword: req.body.cpassword,
      secQue: req.body.secQue,
      profilePic: "Not Uploaded",
      totalDownloads: 0,
      totalPoints: 0,
    });
    const registered = await registerCandidates.save();
    res.status(201).render("login");
  } catch (error) {
    res.status(400).send(error);
  }
});

// login get
app.get("/login", (req, res) => {
  res.render("login");
});

// login post
app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    user = await register.findOne({ email: email });
    userId = user._id;
    fname = user.firstname;
    lname = user.lastname;
    tdown = user.totalDownloads;
    tpoints = user.totalPoints;
    if (user.password === password) {
      let allAssign = assignments
        .find({})
        .then((assign) => {
          res.render("profile", {
            username: fname,
            useremail: user.email,
            allAssign: assign,
            username: fname,
            sirname: lname,
            userId: userId,
            tdown: tdown,
            tpoints: tpoints,
          });
        })
        .catch((error) => {
          res.status(400).send(error);
        });
    } else {
      res.send(`
      <script>
        alert("Wrong Login Details"); window.location.href = "/login";
      </script>`);
    }
  } catch (error) {
    res.send(`
      <script>
        alert("Wrong Login Details"); window.location.href = "/login";
      </script>`);
  }
});

// console.log(fname);

//profile
app.get("/profile", (req, res) => {
  let allAssign = assignments
    .find({})
    .then((assign) => {
      res.render("profile", {
        username: fname,
        useremail: user.email,
        allAssign: assign,
        username: fname,
        sirname: lname,
        userId: userId,
      });
    })
    .catch((error) => {
      res.status(400).send(error);
    });
});

// const downcount = assignments.aggregate([
//   {
//     $group: {
//       _id: { userId: { $userId: "$userId" } },
//       totalDowns: { $sum: "$downloads" },
//       count: { $sum: 1 },
//     },
//   },
// ]);
// console.log(downcount[0]);

//forget pass get
app.get("/forgetPass", (req, res) => {
  res.render("forgetPass");
});

// forgetpass post
app.post("/forgetPass", async (req, res) => {
  try {
    const email = req.body.email;
    const secQue = req.body.secQue;

    user = await register.findOne({ email: email });
    pass = user.password;
    if (user.email === email && user.secQue === secQue) {
      res.status(201).render("showPass", { userpass: pass });
    } else {
      res.send(`
      <script>
        alert("Wrong Credentials"); window.location.href = "/forgetPass";
      </script>`);
    }
  } catch (error) {
    res.send(`
      <script>
        alert("Wrong Credentials"); window.location.href = "/forgetPass";
      </script>`);
  }
});

// upload get
app.get("/upload", (req, res) => {
  res.render("upload", { username: fname, sirname: lname });
});

//assignment post
app.post("/upload", upload.single("notes"), (req, res) => {
  try {
    //date and time
    let today = new Date();
    let dateTime = today.toLocaleString("en-US", "Asia/Delhi");

    const assignmentUpload = new assignments({
      title: req.body.assignmentTitle,
      subject: req.body.sub,
      username: fname,
      sirname: lname,
      userId: userId,
      notes: req.file.filename,
      downloads: 0,
      points: 0,
      totalAmounts: 0,
      dateTime: dateTime,
    });
    const assignmentUploaded = assignmentUpload.save();
    res.send(`
      <script>
        alert("File Uploaded Successfully"); window.location.href = "/cardTable";
      </script>`);
    // res.status(201).redirect("assignments");
  } catch (error) {
    res.status(400).send(error);
  }
});

//cardtable

app.get("/cardTable", (req, res) => {
  let allAssign = assignments
    .find({})
    .then((assign) => {
      res.render("cardTable", {
        allAssign: assign,
        username: fname,
        sirname: lname,
        userId: userId,
      });
    })
    .catch((error) => {
      res.status(400).send(error);
    });
});

// usePoints get
app.get("/usePoints", (req, res) => {
  res.render("404error");
});

//delete
app.get("/delete?:id", (req, res) => {
  const id = req.query.id;
  assignments
    .findByIdAndDelete(id)
    .then((data) => {
      if (!data) {
        res
          .status(404)
          .send({ message: `cannot delete with id ${id}.Maybe id is wrong` });
      } else {
        res.send(`
      <script>
        alert("File Deleted Successfully"); window.location.href = "/profile";
      </script>`);
      }
    })
    .catch((error) => {
      res.status(500).send({ message: "Could not delete id=" + id });
    });
});

//download count
app.get("/update?:id", async (req, res) => {
  const id = req.query.id;
  // console.log(id);
  user = await assignments.findByIdAndUpdate(
    { _id: id },
    { $inc: { downloads: 1, points: 10 } }
  );
  let one = await assignments.findOne({ _id: id });
  let uid = one.userId;
  console.log(uid);
  user = await register.findByIdAndUpdate(
    { _id: uid },
    { $inc: { TotalDownloads: 1, TotalPoints: 10 } }
  );
  console.log(user);
  // let usersInfo = await register.findOne({ id: userId });
  // console.log(usersInfo.totalDownloads);
  res.redirect("assignments");
});

//get edit pro Page
app.get("/editProfile", async (req, res) => {
  // const uid = req.params.id;
  // register.findByIdAndUpdate(id, req.body, { useFindAndModify: true })
  //   .then((data) => {
  //     if (!data) {
  //       res.status(404).send({
  //         message: `cannot update user with ${id},Maybe user not found`,
  //       });
  //     } else {
  //       res.send(data);
  //     }
  //   })
  //   .catch((err) => {
  //     res.status(500).send({ message: "Enter update user information" });
  //   });
  // console.log(userId);
  res.render("404error");
});

// app.put({});

//post edit
// app.post("/editProfile", upload2.single("profilePic"), async (req, res) => {
//   try {
//     const prof = new proedit({
//       userID: userId,
//       profilePic: req.file.filename,
//     });

//     user = await register.findByIdAndUpdate(
//       { _id: userId },
//       {
//         $set: {
//           profilePic: profilePic,
//         },
//       }
//     );
//     res.send(`
//       <script>
//         alert("Profile Uploaded Successfully"); window.location.href = "/profile";
//       </script>`);
//     // res.status(201).redirect("assignments");
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

//404 Error Page
app.get("*", (req, res) => {
  res.render("404error");
});

//Listening to the port
app.listen(port, () => {
  console.log(`Listening to the port ${port}`);
});
