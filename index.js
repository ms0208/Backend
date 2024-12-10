const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const UserModel = require('./models/user');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb://127.0.0.1:27017/emp', {
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'public/images')); // Correct path
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Simplified filename
  },
});

const upload = multer({ storage: storage });

app.post('/upload', upload.single('file'), (req, res) => {
  const newUser = new UserModel({ image: req.file.filename });
  newUser.save()
    .then(result => res.status(201).json({ success: true, image: result.image }))
    .catch(err => {
      console.log(err);
      res.status(500).json({ success: false, message: "Failed to save image" });
    });
});

app.get('/getImage', (req, res) => {
  UserModel.find()
    .then(users => res.json(users))
    .catch(err => {
      console.log(err);
      res.status(500).json({ success: false, message: "Failed to fetch images" });
    });
});

app.listen(4000, () => {
  console.log("Server is listening on port 4000");
});
