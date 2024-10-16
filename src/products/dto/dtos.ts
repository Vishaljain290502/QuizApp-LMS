export class CreateProductDto {
    readonly name: string;
    readonly price: number;
    readonly description: string;
    readonly category: string;  // Category ID
    readonly subcategory: string;  // Subcategory ID
  }

  
  export class UpdateProductDto {
    readonly name?: string;
    readonly price?: number;
    readonly description?: string;
    readonly category?: string;
    readonly subcategory?: string;
  }

  