import { Request, Response } from "express";
import ProductServiceImpl from "@services/impl/product.service.impl";

class ProductController {
  private productService: ProductServiceImpl;

  constructor() {
    this.productService = new ProductServiceImpl();
  }

  createProduct = async (req : Request, res: Response): Promise<void> => {
    try {
        const product = await this.productService.createProduct(req.body);
        res.status(201).json({success: true, message: "Product created successfully", data: product});  
    }catch (error){
        console.error("Error creating product:", error);
        res.status(500).json({success: false, message: "Internal Server Error"});
    }
  } 

  getAllProducts = async (req: Request, res: Response): Promise<void> => {
    try {
        const products = await this.productService.getAllProducts();
        res.status(200).json({success: true , data: products , message: "Products fetched successfully"});
    }catch (error) {
        res.status(500).json({success: false, message: "Internal Server Error"});
    }
  }

  getProductById = async (req: Request, res: Response):Promise<void> => {
    try {
        const product = await this.productService.getProductById(req.params.id);
        if (product){
            res.status(200).json({success: true , data: product, message: "Product fetched successfully"});
        }
        else {
            res.status(404).json({success: false, message: "Product not found"});
        }
    } catch (error) {
        res.status(500).json({success: false, message: "Internal Server Error"});
    }
  }

  updateProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const updatedProduct = await this.productService.updateProduct(req.params.id, req.body);
        res.status(200).json({success: true, data: updatedProduct, message: "Product updated successfully"});
    }catch (error){
        res.status(500).json({success: false, message: "Internal Server Error"});
    }
  }

  deleteProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const productId = req.params.id;
        await this.productService.deleteProduct(productId);
        res.status(200).json({success: true, message: "Product deleted successfully"});

        if(!productId){
            res.status(404).json({success: false, message: "Product not found"});
        }

    } catch (error) {
        res.status(500).json({success: false, message: "Internal Server Error"});
    }
  }



}

export default new ProductController();
