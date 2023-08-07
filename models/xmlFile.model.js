const mongoose = require("mongoose");

const xmlFileSchema = new mongoose.Schema(
    {
        file_url: { type: String, required: true },
        public_id: { type: String, required: true },
        description: { type: String, required: true },
        category: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("xml_file", xmlFileSchema);
