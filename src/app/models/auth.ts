export default class authModel {
  constructor(
    public email: string,
    public password: string,
    public _id?: number,
    public username?: string,
  ) {}
}