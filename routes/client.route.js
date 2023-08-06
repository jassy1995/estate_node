const express = require("express");
let controller = require("../controllers/client.controller");
const { storage } = require("../util/cloudinary");
const multer = require('multer');
const router = express.Router();

// const upload = multer({ storage: storage });
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", upload.single('file'), controller.uploadFile);
router.get("/retrieve", controller.getFiles);


module.exports = router;
