const Property = require("../models/property.model");
const PropertyAdmin = require("../models/propertyAdmin.model");
const PropertyOrder = require("../models/propertyOrder.model");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../util/scripts/jwt");
const cloudinary = require("../util/cloudinary");
const fs = require('fs').promises;
const path = require('path');


exports.getPaginatedProperty = async (req, res, next) => {
  const { query } = req;
  const pageNumber = +query.pageNumber || 1;
  const pageSize = +query.pageSize || 9;
  const country = query?.country;
  const type = query?.type;
  const price = query?.price;
  if (!!country && !!type && !!price) {
    const countryFilter = country.trim() !== 'Location (any)' ? { country: country.trim() } : {};
    const typeFilter = type.trim() !== 'Property type (any)' ? { type: type.trim() } : {};
    const priceFilter = price.trim() !== 'Price range (any)' ? {
      price: {
        $gte: Number(price?.split("-")[0]?.trim()),
        $lte: Number(price?.split("-")[1]?.trim()),
      },
    } : {};

    const properties = await Property.find({ ...countryFilter, ...typeFilter, ...priceFilter })
      .skip(pageSize * (pageNumber - 1))
      .limit(pageSize)
      .sort({ createdAt: -1 });
    const countProperty = await Property.countDocuments({ ...countryFilter, ...typeFilter, ...priceFilter });
    return res.send({
      properties,
      total_count: countProperty,
      pageNumber,
      total_page: Math.ceil(countProperty / pageSize),
    });
  } else {
    const properties = await Property.find()
      .skip(pageSize * (pageNumber - 1))
      .limit(pageSize)
      .sort({ createdAt: -1 });
    const countProperty = await Property.countDocuments();
    return res.send({
      properties,
      total_count: countProperty,
      pageNumber,
      total_page: Math.ceil(countProperty / pageSize),
    });
  }

}

exports.getPropertyById = async (req, res, next) => {
  const property = await Property.findById(req.params.id);
  if (property) {
    return res.send(property);
  } else {
    return res.status(404).send({ message: "Property Not Found" });
  }
};

exports.createAdmin = async (req, res, next) => {
  const adminExist = await PropertyAdmin.findOne({ email: req.body.email });
  if (adminExist) {
    return res.status(401).send({
      message: `<strong>${req.body.email}</strong> has already been taken, try a different one`,
      status: false,
    });
  } else {
    const newUser = new PropertyAdmin({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password),
    });
    const user = await newUser.save();
    return res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user?.isAdmin ? user.isAdmin : true,
      token: generateToken(user),
      status: true,
    });
  }
};

exports.signInAdmin = async (req, res, next) => {
  const user = await PropertyAdmin.findOne({ email: req.body.email });
  if (user) {
    if (bcrypt.compareSync(req.body.password, user.password)) {
      return res.send({
        _id: user._id,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user),
        status: true,
      });
    } else {
      return res.status(401).send({
        message: "Invalid email or password! Please check and try again",
        status: false,
      });
    }
  } else {
    return res.status(401).send({
      message: "Invalid email or password! Please check and try again",
      status: false,
    });
  }
};

exports.createOrder = async (req, res, next) => {
  const newOrder = new PropertyOrder({
    ...req.body,
    property: req.params.id,
  });
  const order = await newOrder.save();
  return res.send(order);
};

exports.getPropertyOrder = async (req, res, next) => {
  const total_count = await PropertyOrder.countDocuments();
  const { query } = req;
  const pageNumber = +query.pageNumber || 1;
  const pageSize = +query.pageSize || 2;
  const orders = await PropertyOrder.find()
    .skip(pageSize * (pageNumber - 1))
    .limit(pageSize)
    .sort({ createdAt: -1 })
    .populate("property");

  return res.send({
    orders,
    total_count,
    pageNumber,
    total_page: Math.ceil(total_count / pageSize),
  });
};

exports.createProperty = async (req, res, next) => {
  // Create a temporary file path
  const tempFilePath = path.join(__dirname, req.file.originalname);
  // Write the buffer contents to the temporary file
  await fs.writeFile(tempFilePath, req.file.buffer);
  const uploader = await cloudinary.uploader.upload(tempFilePath, { resource_type: 'auto' })
  // const uploader = (data) =>
  //   new Promise((resolve, reject) => {
  //     cloudinary.uploader.upload(data.tempFilePath, (err, result) => {
  //       if (err) console.log(err);
  //       resolve(result);
  //     });
  //   });

  const propertyImage = await uploader(req.files.propertyImage);
  const agentImage = await uploader(req.files.agentImage);
  const { price, agentName, agentPhone, ...others } = req.body;
  const property = {
    price: +price,
    image: propertyImage?.secure_url,
    property_image_id: propertyImage?.public_id,
    ...others,
    agent: {
      image: agentImage?.secure_url,
      name: agentName,
      phone: agentPhone,
      agent_image_id: agentImage?.public_id,
    },
  };

  const newProperty = new Property(property);
  const savedProperty = await newProperty.save();
  return res.send(savedProperty);
};

exports.getOption = async (req, res, next) => {
  const countries = await Property.find().distinct("country");
  const types = await Property.find().distinct("type");
  const price = await Property.find().distinct("price");

  const prices = price
    .sort((x, y) => x - y)
    .map((a, c, d) => `${a}-${d[c + 1]}`);
  prices.pop();
  return res.send({ countries, types, prices });
};
