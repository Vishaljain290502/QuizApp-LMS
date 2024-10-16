export class CreateSubcategoryDto {
    readonly name: string;
    readonly category: string;  // Category ID
  }

  export class UpdateSubcategoryDto {
    readonly name?: string;
    readonly category?: string;
  }
  