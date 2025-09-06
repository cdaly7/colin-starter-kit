import React, { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch } from "@/store";
import { InventoryRow } from '@/components/inventory-row';
import { FilterHeader } from '@/components/filter-header';
import {
    uniqueInventoriesParts,
    categoriesInInventories,
    filters as filtersSelector,
    filteredInventories as dataSelector,
    bricklinkInventoryDetailLink,
    selectedCategoryIds as selectedCategoryIdsSelector,
    selectedPartName as selectedPartNameSelector
} from './selectors'
// import {
//     updateInventoryItem,
//     getCategories,
//     getInventories
// } from './thunks'
import { setInventories } from "@/store/bricklinkStoreSlice";
import { setCategories, setFilters } from "./inventorySlice";
import { BricklinkInventoryItem } from '@/types';

export default function App() {
    const dispatch = useDispatch<AppDispatch>();
    const categories = useSelector(categoriesInInventories);
    const filters = useSelector(filtersSelector);
    const uniqueParts = useSelector(uniqueInventoriesParts);
    const data = useSelector(dataSelector);
    const partBricklinkInventoryDetailLink = useSelector(bricklinkInventoryDetailLink);
    const selectedCategoryIds = useSelector(selectedCategoryIdsSelector);
    const selectedPartName = useSelector(selectedPartNameSelector);

    const handleProductUpdate = (data: {
        id: string;
        quantity: number;
        price: number;
        status: boolean;
        condition: string;
    }) => {
        console.log('Product updated:', data);
        // Here you would typically send the data to a server or update local state
    };

    const setPartFilter = async (part: string) => {
        console.log('setPartFilter:', { part });
        dispatch(setFilters({ ...filters, part }));
    };

    const setCategoriesFilter = async (categories: string[]) => {
        dispatch(setFilters({ ...filters, categories, part: undefined }));
    };

    const setConditionFilter = async (condition: string) => {
        dispatch(setFilters({ ...filters, condition }));
    };

    const setColorFilter = async (color: string) => {
        dispatch(setFilters({ ...filters, color }));
    };

    const updateInventoryItem = async (inventoryId: string, data: object) => {
        try {
            const url = `/api/bricklink/inventories/${inventoryId}`;
            console.log('url', url);
            console.log('data', data);
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
            const updatedData = await response.json();
            return updatedData;
        } catch (error) {
            console.error('Error updating inventory item:', error);
        }
    };

    const getCategories = async () => {
        try {
            const categoriesResponse = await fetch(`/api/inventories-categories`);
            if (!categoriesResponse.ok) {
                throw new Error('Network response was not ok');
            }
            return await categoriesResponse.json();
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    }

    const getInventories = async (categories: string[], part: string) => {
        try {
            if (!categories.length) {
                return false;
            }
            let url = `/api/bricklink/inventories?category_id=${categories.join(',')}`
            if (part) {
                url += `&item_no=${part}`
            }
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return dispatch(setInventories(data.data));
        } catch (error) {
            console.error('Error fetching inventories:', error);
        }
    };

    useEffect(() => {
        getCategories().then((data) => dispatch(setCategories(data)));
    }, []);
    
    useEffect(() => {
        getInventories(selectedCategoryIds, filters.part);
    }, [filters.categories]);

    const getItemImage = (type: string, itemNo: string, colorId: string) => {
        const baseUrl = `https://img.bricklink.com/`
        console.log('inventoryItem.item.type', type)
        if (type === 'PART') {
            return `${baseUrl}/P/${colorId}/${itemNo}.jpg`;
        }
        else if (type === 'MINIFIG') {
            return `${baseUrl}/M/${itemNo}.jpg`;
        }
        else {
            return '';
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <FilterHeader
                onNameFilterChange={setPartFilter}
                onCategoryFilterChange={setCategoriesFilter}
                onConditionFilterChange={setConditionFilter}
                onColorFilterChange={setColorFilter}
                availableCatalogs={categories.map(cat => cat.category_name)}
                selectedCategories={filters.categories || []}
                nameFilter={filters.part || ''}
                conditionFilter={filters.condition || ''}
                colorFilter={filters.color || ''}
            />

            <div className="p-8">
                <div className="mx-auto max-w-6xl">
                    {data.length === 0 ? (
                        <div className="text-center text-muted-foreground py-8">
                            {selectedCategoryIds.length === 0 ? (
                                <p>Please select a category.</p>
                            ) : (
                                <div>
                                   <p>No items match your current filters.</p>
                                    <p className="text-sm mt-2">Try adjusting your search criteria.</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <div className="mb-4 text-sm text-muted-foreground">
                                Showing {data.length} of {data.length} products
                            </div>
                            <div className="space-y-4">
                                {data.map((inventory: BricklinkInventoryItem) => (
                                    <InventoryRow
                                        key={inventory.inventory_id}
                                        id={inventory.inventory_id}
                                        image={getItemImage(inventory.item.type, inventory.item.no, inventory.color_id)}
                                        name={inventory.item.name}
                                        color={inventory.color_name}
                                        catalog={[inventory.item.category_id]}
                                        initialQuantity={inventory.quantity}
                                        initialPrice={parseFloat(inventory.unit_price)}
                                        initialStockRoom={inventory.is_stock_room}
                                        initialCondition={inventory.new_or_used}
                                        onUpdate={updateInventoryItem}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}