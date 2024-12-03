export const getTagsToDisplay = (tags) => {
    if (!Array.isArray(tags)) return [];

    return tags.slice(0,3);
}