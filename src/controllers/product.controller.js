import { v2 as cloudinary } from "cloudinary";
import { Product } from "../models/product.model.js";

// add product:

const addProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      category,
      subCategory,
      sizes,
      bestseller,
    } = req.body;

    // Parse sizes to ensure it's an array
    const parsedSizes = JSON.parse(sizes || "[]");

    // Receiving data from multer
    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

    // Creating an array of available images
    const images = [image1, image2, image3, image4].filter(Boolean);

    // Upload images to Cloudinary
    const imagesUrl = await Promise.all(
      images.map(async (image) => {
        try {
          const response = await cloudinary.uploader.upload(image.path, {
            resource_type: "auto",
          });
          return response.secure_url;
        } catch (err) {
          console.error(`Error uploading image: ${err.message}`);
          throw new Error("Failed to upload images");
        }
      })
    );

    console.log("Uploaded Image URLs:", imagesUrl);

    // Create and save the new product
    const newProduct = new Product({
      name,
      description,
      price: Number(price),
      category,
      subCategory,
      bestseller: bestseller === "true", // Simplified boolean conversion
      date: Date.now(),
      sizes: parsedSizes, // Save sizes as an array
      image: imagesUrl,
    });

    console.log("New Product:", newProduct);

    await newProduct.save();

    res.json({ success: true, message: "Product added successfully" });
  } catch (error) {
    console.error("Error in addProduct:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// remove Product:

const removeProduct = async (req, res) => {
    try {
        
        await Product.findByIdAndDelete(req.body.id)
        res.json({ success: true, message: "product removed" });

    } catch (error) {
        res.json({ success: false, message: error.message });
        console.log(error);
    }
};

// list products:

const listProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json({ success: true, products });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// single products;

const singleProduct = async (req, res) => {
  try {
    const {productId} = req.body
    const product = await Product.findById(productId);
    res.json({success:true, product})
  } catch (error) {
    console.log(error)
    res.json({success:false, message:error.message})
  }
};

export { singleProduct, addProduct, removeProduct, listProducts };
