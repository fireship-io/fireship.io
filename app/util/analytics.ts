interface PurchaseItem {
  item_id: string;
  item_name: string;
  price: number;
  quantity: number;
  item_category: string;
  item_variant?: string;
}

interface PurchaseData {
  currency: string;
  value: number;
  items: PurchaseItem[];
}

export function trackCheckoutStart(purchaseData: PurchaseData) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    'event': 'begin_checkout',
    'ecommerce': purchaseData
  });
  
  // Store for success page
  try {
    localStorage.setItem('pending_purchase', JSON.stringify(purchaseData));
  } catch (error) {
    console.error('Error storing purchase data:', error);
  }
}