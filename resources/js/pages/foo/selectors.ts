import { createSelector } from 'reselect';
import { BricklinkInventoryItem, Category } from '@/types';

const bricklinkStore = (state) => state.bricklinkStore;
const inventory = (state) => state.inventory;

/**
 * returns BricklinkInventoryItem[]
 */
export const storeInventories = createSelector(
    inventory,
    (inventory) => inventory.inventories
);

export const categoriesInInventories = createSelector(
    inventory,
    (inventory) => {
        return [...inventory.categories].sort((a: Category, b: Category) => {
            return a.category_name.localeCompare(b.category_name);
        });
    }
);

export const filters = createSelector(
    inventory,
    (inventory) => {
        return inventory.filters;
    }
);

export const data = createSelector(
    bricklinkStore,
    (bricklinkStore) => bricklinkStore.inventories
);

export const filteredInventories = createSelector(
    filters,
    data,
    (filters, data) => {
        let filteredItems = data;
        if (filters.part) {
            filteredItems = data.filter((item: BricklinkInventoryItem) => item.item.name.toLowerCase().includes(filters.part.toLowerCase()));
        }
        if (filters.condition) {
            filteredItems = filteredItems.filter((item: BricklinkInventoryItem) => item.new_or_used === filters.condition);
        }
        if (filters.color) {
            filteredItems = filteredItems.filter((item: BricklinkInventoryItem) => item.color_name.toLowerCase().includes(filters.color.toLowerCase()));
        }
        return [...filteredItems].sort((a: BricklinkInventoryItem, b: BricklinkInventoryItem) => {
            return a.color_name.localeCompare(b.color_name);
        });
    }
);

export const selectedCategoryIds = createSelector(
    categoriesInInventories,
    filters,
    (categoriesInInventories, filterss) => {
        return categoriesInInventories.filter((cat: Category) => {
            return filterss.categories.find((filterCat) => filterCat === cat.category_name);
        }).map(cat => cat.category_id);
    }
);

export const uniqueInventoriesParts = createSelector(
    bricklinkStore,
    (bricklinkStore) => {
        const inventories = bricklinkStore.inventories;
        if (!inventories || inventories.length === 0) {
            return [];
        }
        const uniqueIds = Array.from(new Set(inventories.map(obj => obj.item.no)));

        const uniqueObjects = uniqueIds.map(id => {
            return inventories.find(obj => obj.item.no === id).item; // Finds the first object with that ID
        });

        return uniqueObjects;
    }
);

export const selectedPartName = createSelector(
    uniqueInventoriesParts,
    filters,
    (parts, pageFilters) => {
        if (!parts || parts.length === 0 || !pageFilters.part) {
            return 'All Parts';
        }
        return parts.find((part) => part.no === pageFilters.part)?.name || 'All Parts';
    }
);

export const bricklinkInventoryDetailLink = createSelector(
    filters,
    (filters) => {
        if (!filters.part) {
            return `https://www.bricklink.com/v2/inventory_detail.page?catType=P&catID=${filters.category}`;
        }
        return `https://www.bricklink.com/v2/inventory_detail.page?q=${filters.part}`;
    }
);