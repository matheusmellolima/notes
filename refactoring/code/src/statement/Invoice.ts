import { Performance } from "./Performance";

export default class Invoice {
  constructor(
    readonly customer: string,
    readonly performances: Performance[]
  ) {}
}
