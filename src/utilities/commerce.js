import { CURRENCY_MAPPINGS, CURRENCY_CODE_FALLBACK } from "../constants/currency";

export const parseRecentProductsResponse = response => {
    if (!response || !response.data.products) return [];

    return response.data.products.nodes.map(product => ({...product, variants: product.variants?.nodes || []}));
}

export const parseAllProductsResponse = response => {
    return response.edges.map(({ node: product }) => ({...product, variants: product.variants.nodes}));
}

export const parseProductByHandleResponse = response => {
    return {...response, variants: response.variants.nodes};
}

export const getActiveVariant = variants => {
    if (!Array.isArray(variants)) return undefined;

    return variants[0];
}

export const getCurrencySymbolFromCode = code => {
    return CURRENCY_MAPPINGS[code] || CURRENCY_MAPPINGS[CURRENCY_CODE_FALLBACK];
}

export const generateProductStaticPaths = products => {
    if (!Array.isArray(products)) return [];

    return products.filter(({ handle }) => handle).map(({ handle }) => ({ params: { handle } }));
}
