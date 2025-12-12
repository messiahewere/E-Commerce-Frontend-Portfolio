import ProductsModel from "./products";


export default class OrderModel {
    constructor(
        public groupId: string,
        public total: number,
        public products: ProductsModel[],
        public orderDate: Date,
        public status?: string
    ) {}
}