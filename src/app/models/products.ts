export default class ProductsModel {
  constructor(
    public _id: number,
    public title: string,
    public description: string,
    public price: number,
    public category: string,
    public brand: string,
    public rating: number,
    public stock: number,
    public images: string[],
    public count?: number,
    public deliveryDate?: Date
  ) {}
}