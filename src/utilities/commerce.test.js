import {
    generateProductStaticPaths,
    getCurrencySymbolFromCode,
    getActiveVariant,
    parseRecentProductsResponse,
    parseAllProductsResponse,
    parseProductByHandleResponse
} from './commerce';
import { CURRENCY_MAPPINGS, CURRENCY_CODE_FALLBACK } from '../constants/currency';

describe('generateProductStaticPaths', () => {
  it('should generate static paths from an array of products with handles', () => {
    const products = [
      { handle: 'product-1', title: 'Product 1' },
      { handle: 'product-2', title: 'Product 2' },
      { handle: 'product-3', title: 'Product 3' },
    ];

    const result = generateProductStaticPaths(products);
    expect(result).toEqual([
      { params: { handle: 'product-1' } },
      { params: { handle: 'product-2' } },
      { params: { handle: 'product-3' } },
    ]);
  });

  it('should return an empty array if the products array is empty', () => {
    const products = [];
    const result = generateProductStaticPaths(products);
    expect(result).toEqual([]);
  });

  it('should ignore products without a handle property', () => {
    const products = [
      { handle: 'product-1', title: 'Product 1' },
      { title: 'Product 2' }, // Missing handle
      { handle: 'product-3', title: 'Product 3' },
    ];

    const result = generateProductStaticPaths(products);
    expect(result).toEqual([
      { params: { handle: 'product-1' } },
      { params: { handle: 'product-3' } },
    ]);
  });

  it('should return an empty array if products is not an array', () => {
    const invalidInputs = [null, undefined, {}, 'string', 123, true];

    invalidInputs.forEach(input => {
      const result = generateProductStaticPaths(input);
      expect(result).toEqual([]);
    });
  });
});

describe('getCurrencySymbolFromCode', () => {
  it('should return the correct symbol for a valid currency code', () => {
    expect(getCurrencySymbolFromCode('GBP')).toBe('£');
    expect(getCurrencySymbolFromCode('USD')).toBe('$');
    expect(getCurrencySymbolFromCode('EUR')).toBe('€');
  });

  it('should return the fallback symbol if the currency code is invalid', () => {
    expect(getCurrencySymbolFromCode('JPY')).toBe(CURRENCY_MAPPINGS[CURRENCY_CODE_FALLBACK]);
    expect(getCurrencySymbolFromCode('XYZ')).toBe('£');
  });

  it('should return the fallback symbol if the currency code is undefined', () => {
    expect(getCurrencySymbolFromCode(undefined)).toBe(CURRENCY_MAPPINGS[CURRENCY_CODE_FALLBACK]);
  });

  it('should return the fallback symbol if the currency code is null', () => {
    expect(getCurrencySymbolFromCode(null)).toBe(CURRENCY_MAPPINGS[CURRENCY_CODE_FALLBACK]);
  });

  it('should return the fallback symbol if the currency code is an empty string', () => {
    expect(getCurrencySymbolFromCode('')).toBe(CURRENCY_MAPPINGS[CURRENCY_CODE_FALLBACK]);
  });

  it('should return the fallback symbol if the currency code is not a string', () => {
    expect(getCurrencySymbolFromCode(123)).toBe(CURRENCY_MAPPINGS[CURRENCY_CODE_FALLBACK]);
    expect(getCurrencySymbolFromCode(true)).toBe(CURRENCY_MAPPINGS[CURRENCY_CODE_FALLBACK]);
    expect(getCurrencySymbolFromCode({})).toBe(CURRENCY_MAPPINGS[CURRENCY_CODE_FALLBACK]);
    expect(getCurrencySymbolFromCode([])).toBe(CURRENCY_MAPPINGS[CURRENCY_CODE_FALLBACK]);
  });
});

describe('getActiveVariant', () => {
  it('should return the first variant in the array when variants is a non-empty array', () => {
    const variants = [
      { id: 1, name: 'Variant 1' },
      { id: 2, name: 'Variant 2' },
    ];
    const result = getActiveVariant(variants);
    expect(result).toEqual({ id: 1, name: 'Variant 1' });
  });

  it('should return undefined when variants is an empty array', () => {
    const variants = [];
    const result = getActiveVariant(variants);
    expect(result).toBeUndefined();
  });

  it('should return undefined when variants is not provided', () => {
    const result = getActiveVariant(undefined);
    expect(result).toBeUndefined();
  });

  it('should return undefined when variants is null', () => {
    const result = getActiveVariant(null);
    expect(result).toBeUndefined();
  });

  it('should return undefined when variants is not an array', () => {
    const invalidInputs = [
      'string',
      123,
      { key: 'value' },
      true,
      false,
      undefined,
      null,
    ];

    invalidInputs.forEach(input => {
      const result = getActiveVariant(input);
      expect(result).toBeUndefined();
    });
  });

  it('should handle an array with mixed types and still return the first element', () => {
    const variants = [
      { id: 1, name: 'Variant 1' },
      'string',
      123,
    ];
    const result = getActiveVariant(variants);
    expect(result).toEqual({ id: 1, name: 'Variant 1' });
  });
});

describe('parseRecentProductsResponse', () => {
  it('should parse response and map variants correctly for a valid input', () => {
    const response = {
      data: {
        products: {
          nodes: [
            {
              title: 'Snowboard A',
              description: '',
              productType: 'snowboard',
              availableForSale: true,
              featuredImage: {
                altText: 'Image of Snowboard A',
                url: 'https://example.com/image-a.jpg',
              },
              handle: 'snowboard-a',
              id: 'gid://shopify/Product/123',
              tags: ['Sport', 'Winter'],
              variants: {
                nodes: [{ id: 'gid://shopify/ProductVariant/1', title: 'Variant 1' }],
              },
            },
            {
              title: 'Snowboard B',
              description: 'A premium snowboard.',
              productType: 'snowboard',
              availableForSale: false,
              featuredImage: {
                altText: 'Image of Snowboard B',
                url: 'https://example.com/image-b.jpg',
              },
              handle: 'snowboard-b',
              id: 'gid://shopify/Product/124',
              tags: ['Sport', 'Premium'],
              variants: {
                nodes: [
                  { id: 'gid://shopify/ProductVariant/2', title: 'Variant 1' },
                  { id: 'gid://shopify/ProductVariant/3', title: 'Variant 2' },
                ],
              },
            },
          ],
        },
      },
    };

    const result = parseRecentProductsResponse(response);

    expect(result).toEqual([
      {
        title: 'Snowboard A',
        description: '',
        productType: 'snowboard',
        availableForSale: true,
        featuredImage: {
          altText: 'Image of Snowboard A',
          url: 'https://example.com/image-a.jpg',
        },
        handle: 'snowboard-a',
        id: 'gid://shopify/Product/123',
        tags: ['Sport', 'Winter'],
        variants: [{ id: 'gid://shopify/ProductVariant/1', title: 'Variant 1' }],
      },
      {
        title: 'Snowboard B',
        description: 'A premium snowboard.',
        productType: 'snowboard',
        availableForSale: false,
        featuredImage: {
          altText: 'Image of Snowboard B',
          url: 'https://example.com/image-b.jpg',
        },
        handle: 'snowboard-b',
        id: 'gid://shopify/Product/124',
        tags: ['Sport', 'Premium'],
        variants: [
          { id: 'gid://shopify/ProductVariant/2', title: 'Variant 1' },
          { id: 'gid://shopify/ProductVariant/3', title: 'Variant 2' },
        ],
      },
    ]);
  });

  it('should return an empty array if response.data.products.nodes is empty', () => {
    const response = {
      data: {
        products: {
          nodes: [],
        },
      },
    };

    const result = parseRecentProductsResponse(response);

    expect(result).toEqual([]);
  });

  it('should handle an undefined response gracefully', () => {
    const result = parseRecentProductsResponse(undefined);

    expect(result).toEqual([]);
  });

  it('should handle a null response gracefully', () => {
    const result = parseRecentProductsResponse(null);

    expect(result).toEqual([]);
  });

  it('should return an empty array if the response format is invalid', () => {
    const response = { data: {} };

    const result = parseRecentProductsResponse(response);

    expect(result).toEqual([]);
  });

  it('should handle missing variants gracefully by returning an empty array for variants', () => {
    const response = {
      data: {
        products: {
          nodes: [
            {
              title: 'Snowboard C',
              description: '',
              productType: 'snowboard',
              availableForSale: true,
              featuredImage: {
                altText: 'Image of Snowboard C',
                url: 'https://example.com/image-c.jpg',
              },
              handle: 'snowboard-c',
              id: 'gid://shopify/Product/125',
              tags: ['Sport'],
              variants: null,
            },
          ],
        },
      },
    };

    const result = parseRecentProductsResponse(response);

    expect(result).toEqual([
      {
        title: 'Snowboard C',
        description: '',
        productType: 'snowboard',
        availableForSale: true,
        featuredImage: {
          altText: 'Image of Snowboard C',
          url: 'https://example.com/image-c.jpg',
        },
        handle: 'snowboard-c',
        id: 'gid://shopify/Product/125',
        tags: ['Sport'],
        variants: [],
      },
    ]);
  });
});

describe('parseAllProductsResponse', () => {
    it('should correctly parse the response and transform edges into an array of products with simplified variants', () => {
      const response = {
        edges: [
          {
            cursor: 'eyJsYXN0X2lkIjo5NzQyNjEzMzgxNDIwLCJsYXN0X3ZhbHVlIjo5NzQyNjEzMzgxNDIwfQ==',
            node: {
              id: 'product1',
              title: 'Product 1',
              variants: {
                nodes: [
                  { id: 'variant1', price: '10.00' },
                  { id: 'variant2', price: '15.00' },
                ],
              },
            },
          },
          {
            cursor: 'eyJsYXN0X2lkIjo5NzQyNjEzNDE0MTg4LCJsYXN0X3ZhbHVlIjo5NzQyNjEzNDE0MTg4fQ==',
            node: {
              id: 'product2',
              title: 'Product 2',
              variants: {
                nodes: [
                  { id: 'variant3', price: '20.00' },
                ],
              },
            },
          },
        ],
        pageInfo: {
          hasNextPage: false,
          endCursor: 'eyJsYXN0X2lkIjo5NzQyNjEzNDE0MTg4LCJsYXN0X3ZhbHVlIjo5NzQyNjEzNDE0MTg4fQ==',
        },
      };
  
      const expectedResult = [
        {
          id: 'product1',
          title: 'Product 1',
          variants: [
            { id: 'variant1', price: '10.00' },
            { id: 'variant2', price: '15.00' },
          ],
        },
        {
          id: 'product2',
          title: 'Product 2',
          variants: [
            { id: 'variant3', price: '20.00' },
          ],
        },
      ];
  
      const result = parseAllProductsResponse(response);
      expect(result).toEqual(expectedResult);
    });
  
    it('should return an empty array if response has no edges', () => {
      const response = {
        edges: [],
        pageInfo: {
          hasNextPage: false,
          endCursor: null,
        },
      };
  
      const result = parseAllProductsResponse(response);
      expect(result).toEqual([]);
    });
  
    it('should handle nodes without variants gracefully', () => {
      const response = {
        edges: [
          {
            cursor: 'eyJsYXN0X2lkIjo5NzQyNjEzMzgxNDIwLCJsYXN0X3ZhbHVlIjo5NzQyNjEzMzgxNDIwfQ==',
            node: {
              id: 'product1',
              title: 'Product 1',
              variants: { nodes: [] },
            },
          },
        ],
        pageInfo: {
          hasNextPage: false,
          endCursor: 'eyJsYXN0X2lkIjo5NzQyNjEzMzgxNDIwLCJsYXN0X3ZhbHVlIjo5NzQyNjEzMzgxNDIwfQ==',
        },
      };
  
      const expectedResult = [
        {
          id: 'product1',
          title: 'Product 1',
          variants: [],
        },
      ];
  
      const result = parseAllProductsResponse(response);
      expect(result).toEqual(expectedResult);
    });
  });

describe('parseProductByHandleResponse', () => {
  it('should correctly transform the response and include variants without nodes', () => {
    const response = {
      title: 'The Compare at Price Snowboard',
      description: '',
      productType: 'snowboard',
      availableForSale: true,
      featuredImage: {
        altText: 'Top and bottom view of a snowboard. The top view shows pixelated clouds, with the top-most one being\n' +
          '        the shape of the Shopify bag logo. The bottom view has a pixelated cloudy sky with blue, pink and purple\n' +
          '        colours.',
        url: 'https://cdn.shopify.com/s/files/1/0911/8718/3916/files/snowboard_sky.png?v=1733166119'
      },
      handle: 'the-compare-at-price-snowboard',
      id: 'gid://shopify/Product/9742613414188',
      tags: ['Accessory', 'Sport', 'Winter'],
      variants: {
        nodes: [
          { id: 'variant1', price: '100.00' },
          { id: 'variant2', price: '150.00' },
        ],
      },
    };

    const expectedResult = {
      ...response,
      variants: [
        { id: 'variant1', price: '100.00' },
        { id: 'variant2', price: '150.00' },
      ],
    };

    const result = parseProductByHandleResponse(response);
    expect(result).toEqual(expectedResult);
  });

  it('should return an object with an empty array for variants if nodes are empty', () => {
    const response = {
      title: 'The Compare at Price Snowboard',
      description: '',
      productType: 'snowboard',
      availableForSale: true,
      featuredImage: {
        altText: 'Top and bottom view of a snowboard. The top view shows pixelated clouds, with the top-most one being\n' +
          '        the shape of the Shopify bag logo. The bottom view has a pixelated cloudy sky with blue, pink and purple\n' +
          '        colours.',
        url: 'https://cdn.shopify.com/s/files/1/0911/8718/3916/files/snowboard_sky.png?v=1733166119'
      },
      handle: 'the-compare-at-price-snowboard',
      id: 'gid://shopify/Product/9742613414188',
      tags: ['Accessory', 'Sport', 'Winter'],
      variants: { nodes: [] },
    };

    const expectedResult = {
      ...response,
      variants: [],
    };

    const result = parseProductByHandleResponse(response);
    expect(result).toEqual(expectedResult);
  });

  it('should not modify the original object structure except for variants', () => {
    const response = {
      title: 'Minimal Product',
      description: 'A minimal product description.',
      productType: 'minimal',
      availableForSale: false,
      featuredImage: null,
      handle: 'minimal-product',
      id: 'gid://shopify/Product/1234567890',
      tags: [],
      variants: { nodes: [{ id: 'variant1', price: '50.00' }] },
    };

    const expectedResult = {
      ...response,
      variants: [{ id: 'variant1', price: '50.00' }],
    };

    const result = parseProductByHandleResponse(response);
    expect(result).toEqual(expectedResult);
  });
});
