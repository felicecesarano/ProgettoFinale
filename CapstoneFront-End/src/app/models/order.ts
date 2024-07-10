export interface Order {
  id: number;
  customerId: number;
  productId: number;
  size: string;
  quantity: number;
  totalAmount: number;
  status: string;
}