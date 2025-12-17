import ProductsModel from "./products";


export default class OrderModel {
    constructor(
        public total: number,
        public products: ProductsModel[],
        public orderDate: Date,
        public status?: string,
        public _id?: string,
        public userId?: string
    ) {}
}