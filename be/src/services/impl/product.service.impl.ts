import { IProduct } from "@models/product";
import ProductService from "@services/product.service";
import ProductModel from "@models/product";
import { createProductDTO } from "dtos/request/products/CreateProductDTO.request";
import { UpdateProductDTO } from "dtos/request/products/updateProductDTO";
import {
  FilterProductDTO,
  PaginatedResult,
} from "dtos/request/products/FilterProductDTO.request";

class ProductServiceImpl implements ProductService {
  async createProduct(data: createProductDTO): Promise<IProduct> {
    const productModel = ProductModel.getModel();
    const newProduct = new productModel(data);
    return await newProduct.save();
  }

  async getAllProducts(
    filters?: FilterProductDTO
  ): Promise<PaginatedResult<IProduct>> {
    const productModel = ProductModel.getModel();

    // Build query object
    const query: any = {};

    // Text filters (partial match, case-insensitive)
    if (filters?.name) {
      query.name = { $regex: filters.name, $options: "i" };
    }
    if (filters?.brand) {
      query.brand = { $regex: filters.brand, $options: "i" };
    }
    if (filters?.category) {
      query.category = { $regex: filters.category, $options: "i" };
    }
    if (filters?.status) {
      query.status = filters.status;
    }

    // Filter by variant properties
    if (filters?.size) {
      query["variants.size"] = filters.size;
    }
    if (filters?.color) {
      query["variants.color"] = { $regex: filters.color, $options: "i" };
    }

    // Price range filter
    if (filters?.minPrice !== undefined || filters?.maxPrice !== undefined) {
      query["variants.price"] = {};
      if (filters?.minPrice !== undefined) {
        query["variants.price"].$gte = filters.minPrice;
      }
      if (filters?.maxPrice !== undefined) {
        query["variants.price"].$lte = filters.maxPrice;
      }
    }

    // Pagination
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const skip = (page - 1) * limit;

    // Sorting
    const sortBy = filters?.sortBy || "createdAt";
    const sortOrder = filters?.sortOrder === "asc" ? 1 : -1;
    const sort: any = { [sortBy]: sortOrder };

    // Execute query with pagination
    const [products, total] = await Promise.all([
      productModel.find(query).sort(sort).skip(skip).limit(limit).exec(),
      productModel.countDocuments(query).exec(),
    ]);

    return {
      data: products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getProductById(id: string): Promise<any> {
    const productModel = ProductModel.getModel();
    return await productModel.findOne({ productId: id }).exec();
  }

  async updateProduct(id: string, data: UpdateProductDTO): Promise<IProduct> {
    const productModel = ProductModel.getModel();
    const updatedProduct = await productModel
      .findOneAndUpdate({ productId: id }, data, {
        new: true,
        runValidators: true,
      })
      .exec();

    if (!updatedProduct) {
      throw new Error("Product not found");
    }
    return updatedProduct;
  }

  async deleteProduct(id: string): Promise<void> {
    const productModel = ProductModel.getModel();
    await productModel.findOneAndDelete({ productId: id }).exec();
  }
}

export default ProductServiceImpl;
