import express from "express";
import slugify from "slugify";
import {
  newProductValidation,
  updateProductValidation,
} from "../middlewares/joi-validation/productCatValidation.js";
import {
  deletemultipleProducts,
  getProduct,
  getMultipleProducts,
  insertProduct,
  updateProductById,
} from "../models/product/Product.model.js";

// multer setup
import multer from "multer";
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(file);
    // validation test
    let error = null;

    cb(error, "public/img/products");
  },
  filename: (req, file, cb) => {
    const fullFileName = Date.now() +"-"+ file.originalname
    cb(null, fullFileName);
  },
});

const upload = multer({storage})
const router = express.Router();

router.get("/:_id?", async (req, res, next) => {
  try {
    const { _id } = req.params;
    const products = _id
      ? await getProduct({ _id })
      : await getMultipleProducts();
    res.json({
      status: "success",
      message: "product lists",
      products,
    });
  } catch (error) {
    error.status = 500;
    next(error);
  }
});

router.post("/",upload.array("images",5), newProductValidation, async (req, res, next) => {
  try {
    const files = req.files
    console.log(files)

    console.log(req.body);
    const { name } = req.body;

    const images = files.map(img=>img.path)
    console.log(images)

    const slug = slugify(name, { lower: true, trim: true });
    req.body.slug = slug;
    const result = await insertProduct({...req.body,images,thumbnail:images[0]});
    result?._id
      ? res.json({
          status: "success",
          message: "New product added",
        })
      : res.json({
          status: "error",
          message: "Error ! Unable to create new product",
        });
  } catch (error) {
    if (error.message.includes("E11000 duplicate key error collection")) {
      error.message = "Another product with similar name or SKU already exists";
      error.status = 200;
    }
    next(error);
  }
});

router.delete("/", async (req, res, next) => {
  try {
    const ids = req.body;
    if (ids.length) {
      const result = await deletemultipleProducts(ids);
      console.log(result);
      if (result?.deletedCount) {
        return res.json({
          status: "success",
          message: "Selected product has been deleted",
        });
      }
    }
    res.json({
      status: "error",
      message: "Unable to delete the product, please try again later",
    });
  } catch (error) {
    next(error);
  }
});

router.put("/",upload.array("newImages",5), updateProductValidation, async (req, res, next) => {
  try {
    console.log(req.body)
    
    const { _id,imgToDelete,...rest } = req.body;
    // Make new array for the images and replace in the database

    const files = req.files
    const images = files.map(img=>img.path) 
  // new incoming images
    const oldImgList = rest.images.split(',')
    // old images from database before editing product
    // imgToDelete holds

    // remove deleted image from oldImageList
    const filteredImages = oldImgList.filter((img)=>!imgToDelete.includes(img))

    rest.images = [...filteredImages,...images]
    // Delete image from the file system
    const result = await updateProductById(_id, rest);

    result?._id
      ? res.json({
          status: "success",
          message: "Product has been updated",
          result
        })
      : res.json({
          status: "Error",
          message: "Unable to update product, please try again later",
        });
  } catch (error) {
    next(error);
  }
});

export default router;
