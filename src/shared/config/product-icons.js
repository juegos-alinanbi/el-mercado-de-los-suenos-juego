export const productIconMap = {
  "product-pan": "bread",
  "product-milk": "milk",
  "product-apple": "apple",
  "product-juice": "juice",
  "product-cookies": "cookie",
  "product-cheese": "cheese",
  "product-banana": "banana",
  "product-carrot": "carrot",
  "product-egg": "egg",
  "product-chocolate": "chocolate-bar",
};

export function getProductIcon(productId) {
  return productIconMap[productId] ?? "bags";
}
