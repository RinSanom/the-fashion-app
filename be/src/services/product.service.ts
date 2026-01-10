import { IProduct } from "@models/product";
import { createProductDTO } from "dtos/request/products/CreateProductDTO.request";
import {
  FilterProductDTO,
  PaginatedResult,
} from "dtos/request/products/FilterProductDTO.request";

export default interface ProductService {
  createProduct(data: createProductDTO): Promise<IProduct>;
  getAllProducts(
    filters?: FilterProductDTO
  ): Promise<PaginatedResult<IProduct>>;
  getProductById(id: string): Promise<IProduct>;
  updateProduct(id: string, data: any): Promise<any>;
  deleteProduct(id: string): Promise<void>;
}
