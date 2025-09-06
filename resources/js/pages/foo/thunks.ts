import { AppDispatch } from "@/store";
import { setInventories } from "@/store/bricklinkStoreSlice";
import { setCategories } from "./inventorySlice";

export const updateInventoryItem = async (inventoryId: string, data: object) => {
    try {
        const url = `/api/bricklink/inventories/${inventoryId}`;
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Error updating inventory item:', error);
    }
};

export const getCategories = () => async (dispatch: AppDispatch) => {
    try {
        const categoriesResponse = await fetch(`/api/inventories-categories`);
        if (!categoriesResponse.ok) {
            throw new Error('Network response was not ok');
        }
        return categoriesResponse.json();
    } catch (error) {
        console.error('Error fetching categories:', error);
    }
};

export const getInventories = (categories: string[], part: string) => async (dispatch: AppDispatch) => {
    try {
        if (!categories.length) {
            return false;
        }
        let url = `/api/bricklink/inventories?category_id=${categories.join(',')}`;
        if (part) {
            url += `&item_no=${part}`;
        }
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        dispatch(setInventories(data.data));
    } catch (error) {
        console.error('Error fetching inventories:', error);
    }
};