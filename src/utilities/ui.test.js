import { describe, it } from '@jest/globals';
import { getTagsToDisplay } from './ui';

describe('getTagsToDisplay', () => {
  it('should return the first three tags from the array', () => {
    const tags = ['Tag1', 'Tag2', 'Tag3', 'Tag4', 'Tag5'];
    const result = getTagsToDisplay(tags);
    expect(result).toEqual(['Tag1', 'Tag2', 'Tag3']);
  });

  it('should return all tags if the array has fewer than three tags', () => {
    const tags = ['Tag1', 'Tag2'];
    const result = getTagsToDisplay(tags);
    expect(result).toEqual(['Tag1', 'Tag2']);
  });

  it('should return an empty array if the input array is empty', () => {
    const tags = [];
    const result = getTagsToDisplay(tags);
    expect(result).toEqual([]);
  });

  it('should return an empty array if the input is null', () => {
    const tags = null;
    const result = getTagsToDisplay(tags);
    expect(result).toEqual([]);
  });

  it('should return an empty array if the input is undefined', () => {
    const result = getTagsToDisplay(undefined);
    expect(result).toEqual([]);
  });

  it('should return an empty array if the input is not an array', () => {
    const invalidInputs = [
      'string',
      123,
      { key: 'value' },
      true,
      false,
      null,
      undefined,
    ];

    invalidInputs.forEach(input => {
      const result = getTagsToDisplay(input);
      expect(result).toEqual([]);
    });
  });
});
