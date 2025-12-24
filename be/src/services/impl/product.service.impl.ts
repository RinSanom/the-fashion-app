import { IProduct } from "@models/product";
import ProductService from "@services/product.service";
import ProductModel from "@models/product";
import { createProductDTO } from "dtos/request/products/CreateProductDTO.request";
import { UpdateProductDTO } from "dtos/request/products/updateProductDTO";

class ProductServiceImpl implements ProductService {
  async createProduct(data: createProductDTO): Promise<IProduct> {
    const productModel = ProductModel.getModel();
    const newProduct = new productModel(data);
    return await newProduct.save();
  }
  async getAllProducts(): Promise<[IProduct[]]> {
    const productModel = ProductModel.getModel();
    const products = await productModel.find();
    return [products];
  }
  async getProductById(id: string): Promise<any> {
    const productModel = ProductModel.getModel();
    return await productModel.findOne({ productId: id }).exec();
  }
  async updateProduct(id: string, data: UpdateProductDTO): Promise<IProduct> {
    const productModel = ProductModel.getModel();
    const updatedProduct =  await productModel.findOneAndUpdate(
        { productId: id},
        data ,
        { new: true , runValidators: true}
    ).exec();

    if (!updatedProduct) {
        throw new Error("Product not found");
    }
    return updatedProduct;

  }
  async deleteProduct(id: string): Promise<void> {
    const productModel = ProductModel.getModel();
    await productModel.findOneAndDelete({ productId: id}).exec();
  }
}

export default ProductServiceImpl;
