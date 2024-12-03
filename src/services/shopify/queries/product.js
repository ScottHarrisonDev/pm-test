export const recentProducts = `
  query allProducts($first: Int) {
    products(first: $first, sortKey: CREATED_AT, reverse: true) {
      nodes {
        title
        description
        productType
        availableForSale
        featuredImage {
          altText
          url
        }
        handle
        id
        tags
        variants(first: 10) {
          nodes {
            availableForSale
            id
            image {
              altText
              url
            }
            price {
              amount
              currencyCode
            }
            sku
            title
          }
        }
      }
    }
  }
`;

export const allProducts = `
  query allProducts($after: String) {
    products(first: 20, after: $after) {
      edges {
        cursor
        node {
          title
          description
          productType
          availableForSale
          featuredImage {
            altText
            url
          }
          handle
          id
          tags
          variants(first: 10) {
            nodes {
              availableForSale
              id
              image {
                altText
                url
              }
              price {
                amount
                currencyCode
              }
              sku
              title
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const productByHandle = `
  query GetProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      title
      description
      productType
      availableForSale
      featuredImage {
        altText
        url
      }
      handle
      id
      tags
      variants(first: 10) {
        nodes {
          availableForSale
          id
          image {
            altText
            url
          }
          price {
            amount
            currencyCode
          }
          sku
          title
        }
      }
    }
  }
`;