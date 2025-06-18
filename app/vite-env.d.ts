/// <reference types="svelte" />
/// <reference types="vite/client" />

interface Window {
    dataLayer: Array<{
      event?: string;
      ecommerce?: {
        items?: Array<{
          item_id: string;
          item_name: string;
          item_category?: string;
          price: number;
          quantity: number;
        }>;
        value?: number;
        currency?: string;
      };
      [key: string]: any;
    }>;
  }