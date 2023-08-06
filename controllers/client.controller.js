const XmlFile = require("../models/xmlFile.model");
const { cloudinary } = require("../util/cloudinary");
const fs = require('fs').promises;
const path = require('path');


exports.uploadFile = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ status: false, message: 'No file uploaded or empty file', data: null });
    }
    if (!req.body.description) {
        return res.status(400).json({ status: false, message: 'Description is required', data: null });
    }
    // Create a temporary file path
    const tempFilePath = path.join(__dirname, req.file.originalname);
    // Write the buffer contents to the temporary file
    await fs.writeFile(tempFilePath, req.file.buffer);
    const result = await cloudinary.uploader.upload(tempFilePath, { resource_type: 'auto' })

    // Use the path of the uploaded file on disk for Cloudinary upload
    //const result = await cloudinary.uploader.upload(req.file.path, { resource_type: 'auto' })
    // Delete the uploaded file from disk after Cloudinary upload
    // fs.unlink(req.file.path, (err) => {
    //     if (err) {
    //         console.error("Error deleting file from disk:", err);
    //     }
    // });

    const payload = { file_url: result?.secure_url, public_id: result.public_id, description: req.body.description }
    const newFile = new XmlFile(payload);
    const savedFile = await newFile.save();
    return res.status(200).json({ status: false, message: "upload successful", data: savedFile });
}
exports.getFiles = async (req, res) => {
    const retrieved_files = await XmlFile.find().sort({ createdAt: -1 })
    return res.status(200).json({ status: true, message: "Retrieved successful", data: retrieved_files });
}
