import { ProductModel } from "../models/product.model.js";
import { deleteFile, uploadFiles } from "../services/storage.service.js";
import pLimit from "p-limit";
import crypto from "crypto";
import mongoose from "mongoose";




export const createProductController = async (req, res) => {
    let uploadedFiles = [];

    try {
        const { title, description, price, sizes } = req.body;
        const images = req.files;

        if (!images || images.length === 0) {
            return res.status(400).json({
                message: "At least one product image is required",
            });
        }

        const limit = pLimit(4);

        const uploadPromises = images.map((image) =>
            limit(async () => {
                const fileName = `${crypto.randomUUID()}-${image.originalname}`;

                return await uploadFiles({
                    buffer: image.buffer,
                    fileName,
                });
            })
        );

        uploadedFiles = await Promise.all(uploadPromises);

        const productImages = uploadedFiles.map((file) => ({
            url: file.url,
            fileId: file.fileId,
        }));

        const product = await ProductModel.create({
            title,
            description,
            price,
            sizes,
            images: productImages,
            seller: req.user.id,
        });

        return res.status(201).json({
            message: "Product created successfully",
            data: {
                product,
            },
        });
    } catch (error) {
        console.error("Create Product Error:", error);

        if (uploadedFiles.length > 0) {
            await Promise.allSettled(
                uploadedFiles.map((file) => deleteFile(file.fileId))
            );
        }

        return res.status(500).json({
            message: "Unable to create product",
        });
    }
};





export const listAllPublishedProducts = async (req, res) => { 
    try {
        const publishedProducts = await ProductModel.find({ published: true });

        return res.status(200).json({
            message: publishedProducts.length === 0 ? "No Published products found" : "Fetched all the published products",
            data: {
                products: publishedProducts,
            }
        })
    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong",
        })
    }
}





export const listAllProducts = async (req, res) => { 
    try {
        const allProducts = await ProductModel.find();

        return res.status(200).json({
            message: allProducts.length === 0 ? "No products found" : "Fetched all products",
            data: {
                products: allProducts,
            }
        })
    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong",
        })
    }
}




export const getSingleProduct = async (req, res) => { 
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid product ID",
            });
        }

        const product = await ProductModel.findById(id);

        if (!product) { 
            return res.status(401).json({
                message: "Product not found with this id",
            })
        }

        return res.status(200).json({
            message: "Product fetched successfully",
            data: {
                product: product,
            }
        })
    } catch (error) {
        return res.status(500).json({
            message: "something went wrong",
        })
    }
}




export const deleteProduct = async (req, res) => { 
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid product ID",
            });
        }

        const deletedProduct = await ProductModel.findByIdAndDelete(id);

        if (!deletedProduct) { 
            return res.status(404).json({
                message: "Product not found with this id",
            })
        }

        await Promise.allSettled(
            deletedProduct.images.map((image) =>
                deleteFile(image.fileId)
            )
        );

        return res.status(200).json({
            message: "Product deleted successfully",
            data: {
                product: deletedProduct,
            }
        })
    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong",
        })
    }
}





export const updateProduct = async (req, res) => {
    let newlyUploadedFiles = [];

    try {
        const {
            title,
            description,
            price,
            sizes,
            existingImageIds,
        } = req.body;

        const newImages = req.files || [];
        const { id } = req.params;

        // 1. Validate product ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid product ID",
            });
        }

        // 2. Find product
        const product = await ProductModel.findById(id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found with this id",
            });
        }

        // 3. Existing images that seller wants to keep
        const imagesToKeep = product.images.filter((image) =>
            existingImageIds.includes(image.fileId)
        );

        // 4. Existing images that seller removed
        const imagesToDelete = product.images.filter(
            (image) => !existingImageIds.includes(image.fileId)
        );

        // 5. Check final image count
        const finalImageCount =
            imagesToKeep.length + newImages.length;

        if (finalImageCount === 0) {
            return res.status(400).json({
                message: "At least one product image is required",
            });
        }

        if (finalImageCount > 7) {
            return res.status(400).json({
                message: "A product can have only 7 images",
            });
        }

        // 6. Upload new images
        const limit = pLimit(4);

        const uploadPromises = newImages.map((image) =>
            limit(async () => {
                const fileName = `${crypto.randomUUID()}-${image.originalname}`;

                return await uploadFiles({
                    buffer: image.buffer,
                    fileName,
                });
            })
        );

        newlyUploadedFiles = await Promise.all(uploadPromises);

        // 7. Convert new images into DB format
        const newProductImages = newlyUploadedFiles.map((file) => ({
            url: file.url,
            fileId: file.fileId,
        }));

        // 8. Final images
        const finalImages = [
            ...imagesToKeep,
            ...newProductImages,
        ];

        // 9. Update product
        const updatedProduct = await ProductModel.findByIdAndUpdate(
            id,
            {
                title,
                description,
                price,
                sizes,
                images: finalImages,
            },
            {
                new: true,
                runValidators: true,
            }
        );

        // 10. Delete removed images from ImageKit
        await Promise.allSettled(
            imagesToDelete.map((image) =>
                deleteFile(image.fileId)
            )
        );

        // 11. Response
        return res.status(200).json({
            message: "Product updated successfully",
            data: {
                product: updatedProduct,
            },
        });
    }
    catch (error) {
        console.error("Update Product Error:", error);

        // Delete newly uploaded images if update failed
        if (newlyUploadedFiles.length > 0) {
            await Promise.allSettled(
                newlyUploadedFiles.map((file) =>
                    deleteFile(file.fileId)
                )
            );
        }

        return res.status(500).json({
            message: "Something went wrong",
        });
    }
};






export const unListProductController = async (req, res) => { 
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            message: "Invalid product ID",
        });
    }

    const product = await ProductModel.findById(id);

    if (!product) { 
        return res.status(404).json({
            message: "Product not found with this id",
        })
    }

    await ProductModel.findByIdAndUpdate(id, {
        published: false,
    });

    return res.status(200).json({
        message: "Product unlisted successfully",
    })
}





export const listProductController = async (req, res) => { 
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            message: "Invalid product ID",
        });
    }

    const product = await ProductModel.findById(id);

    if (!product) { 
        return res.status(404).json({
            message: "Product not found with this id",
        })
    }

    await ProductModel.findByIdAndUpdate(id, {
        published: true,
    });

    return res.status(200).json({
        message: "Product listed successfully",
    })
}


