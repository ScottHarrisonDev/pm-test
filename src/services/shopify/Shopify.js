import {createStorefrontApiClient} from '@shopify/storefront-api-client';
import { recentProducts, allProducts, productByHandle } from './queries/product';
import { parseRecentProductsResponse, parseAllProductsResponse, parseProductByHandleResponse } from '../../utilities/commerce';

const client = createStorefrontApiClient({
    storeDomain: import.meta.env.SHOPIFY_DOMAIN,
    apiVersion: '2024-10',
    publicAccessToken: import.meta.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
});

export const getMostRecentProducts = async (amount) => {
    const response = await client.request(recentProducts, { variables: { first: amount }});

    return parseRecentProductsResponse(response);
}

export const getAllProducts = async (cursor = null) => {
    const { data: { products } } = await client.request(allProducts, { variables: { after: cursor }});

    return parseAllProductsResponse(products);
}

export const getProductByHandle = async (handle) => {
    const { data: { productByHandle: product } } = await client.request(productByHandle, { variables: { handle }});

    return parseProductByHandleResponse(product);
}