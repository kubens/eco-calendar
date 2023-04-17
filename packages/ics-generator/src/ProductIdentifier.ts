import { CONSTRAINTS } from "./Constraints"

export interface ProductIdentifier {
  company: string
  product: string
  language?: string
}

export const DEFAULT_PRODUCT_ID: ProductIdentifier = {
  company: CONSTRAINTS.company,
  product: CONSTRAINTS.product
}

export function formatProductIdentifier(productId: ProductIdentifier): string {
  let output = `//${productId.company}//${productId.product}`

  if (productId.language) {
    output += `//${productId.language}`
  }

  return output
}
