/**
 * Generates the BrickLink image URL for an item
 * @param type The type of item (e.g., 'PART', 'MINIFIG', etc.)
 * @param itemNo The item number/ID
 * @param colorId The color ID (optional)
 * @returns The complete image URL
 */
export const getItemImage = (type: string, itemNo: string, colorId?: string): string => {
    const baseUrl = 'https://img.bricklink.com';
    
    if (!type || !itemNo) {
        return '';
    }

    if (colorId) {
        return `${baseUrl}/P/${colorId}/${itemNo}.jpg`;
    }

    return `${baseUrl}/${type}/${itemNo}.jpg`;
};