export interface Order {
  id: string; // Se è l'ID dell'ordine nel backend
  userEmail: string;
  shippingAddress: {
    address: string;
    postalCode: string;
    city: string;
    province: string;
  };
  productId: string[]; // ID del prodotto
  totalCost: number; // Costo totale dell'ordine
}
