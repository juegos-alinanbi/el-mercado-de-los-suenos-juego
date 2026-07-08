export const productIconMap = {
  "product-pan": "bread",
  "product-milk": "milk",
  "product-apple": "apple",
  "product-juice": "juice",
  "product-cookies": "cookie",
  "product-cheese": "cheese",
};

export function getProductIcon(productId) {
  return productIconMap[productId] ?? "bags";
}
