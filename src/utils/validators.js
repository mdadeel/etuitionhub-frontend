// Frontend validation utilities

/**
 * Validates MongoDB ObjectId format
 * @param {string} id - The ID string to validate
 * @returns {boolean}
 */
export const isValidObjectId = (id) => {
    if (!id) return false;
    return /^[a-f\d]{24}$/i.test(id);
};
