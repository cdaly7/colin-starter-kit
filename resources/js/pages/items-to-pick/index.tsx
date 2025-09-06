import React, { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch } from "@/store";
import { OrderFillRow } from '@/components/order-filment-row';
import { FilterHeader } from '@/components/filter-header';
import {
    ordersToPickWithStatus as ordersSelector,
    categoriesInOrders as categoriesSelector,
    filters as filtersSelector,
    filteredItems as dataSelector,
    selectedCategoryIds as selectedCategoryIdsSelector,
} from './selectors'
// import {
//     updateInventoryItem,
//     getCategories,
//     getInventories
// } from './thunks'
import { setInventories } from "@/store/bricklinkStoreSlice";
import { setCategories, setFilters } from "./itemsToPickSlice";
import { setOrders, setOrderItem } from "@/store/orderSlice";
import { BricklinkInventoryItem } from '@/types';
import { getItemImage } from '@/utils/image-formatter';
import { ApplicationOrderItem, Category } from '@/types';
import { updateOrderItem } from '@/store/orderItemsSlice';

export default function App() {
    const dispatch = useDispatch<AppDispatch>();
    const orders = useSelector(ordersSelector);
    const categories: Category[] = useSelector(categoriesSelector);
    const filters = useSelector(filtersSelector);
    const data = useSelector(dataSelector);
    const selectedCategoryIds = useSelector(selectedCategoryIdsSelector);

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

    const setOrdersFilter = (orders: string[]) => {
        dispatch(setFilters({ ...filters, orders, categories: [], part: undefined }));
    };

    const setCategoriesFilter = (categories: string[]) => {
        dispatch(setFilters({ ...filters, categories, part: undefined }));
    };

    const setPartFilter = (part: string) => {
        console.log('setPartFilter:', { part });
        dispatch(setFilters({ ...filters, part }));
    };

    const setColorFilter = (color: string) => {
        dispatch(setFilters({ ...filters, color }));
    };
    
    const setConditionFilter = (condition: string) => {
        dispatch(setFilters({ ...filters, condition }));
    };

    const updateOrderItem = async (orderId: string, itemId: string, item: OrderItem) => {
        try {
            const response = await fetch(`/api/local-orders/${orderId}/items/${item.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(item),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return data; // Return the data for further processing
        } catch (error) {
            console.error('Error updating item:', error);
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

    const getOrders = async () => {
        try {
            const response = await fetch('/api/local-orders');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };
    
    const handleUpdateOnClick = (itemId: string, updatedData: object) => {
        const item: ApplicationOrderItem = data.find((order: ApplicationOrderItem) => order.inventory_id == itemId);
        updateOrderItem(item ? item.order_id : undefined, itemId, { ...item, ...updatedData }).then((data) => {
            dispatch(setOrderItem(data));
        });
    };

    /*
    Initialize 
    */
    useEffect(() => {
        getCategories().then((data) => dispatch(setCategories(data)));
        getOrders().then((data) => {
            dispatch(setOrders(data));
        });
    }, []);

    return (
        <div className="min-h-screen bg-background">
            <FilterHeader
                onNameFilterChange={setPartFilter}
                onCategoryFilterChange={setCategoriesFilter}
                onConditionFilterChange={setConditionFilter}
                onColorFilterChange={setColorFilter}
                onOrderFilterChange={setOrdersFilter}
                onPickedFilterChange={(showPicked: boolean) => {
                    dispatch(setFilters({ ...filters, showPicked }));
                }}
                onPackedFilterChange={(showPacked: boolean) => {
                    dispatch(setFilters({ ...filters, showPacked }));
                }}
                availableOrders={orders}
                availableCatalogs={categories.map((cat: Category) => cat.category_name)}
                selectedOrders={filters.orders || []}
                selectedCategories={filters.categories || []}
                nameFilter={filters.part || ''}
                conditionFilter={filters.condition || ''}
                colorFilter={filters.color || ''}
                showPicked={filters.showPicked}
            />

            <div className="p-8">
                <div className="mx-auto max-w-6xl">
                    {data.length === 0 ? (
                        <div className="text-center text-muted-foreground py-8">
                            {selectedCategoryIds.length === 0 ? (
                                <p>No items are found.</p>
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
                                {data.map((orderItem: ApplicationOrderItem) => (
                                    <OrderFillRow
                                        key={orderItem.id}
                                        id={orderItem.inventory_id}
                                        image={getItemImage(orderItem.type, orderItem.item_no, orderItem.color_id)}
                                        name={orderItem.name}
                                        color={orderItem.color_name}
                                        orderId={orderItem.order_id}
                                        category={orderItem.category_name}
                                        orderedQuantity={orderItem.total_quantity}
                                        initialQuantity={orderItem.picked_quantity}
                                        initialCondition={orderItem.condition}
                                        initialPacked={orderItem.is_packed}
                                        onUpdate={handleUpdateOnClick}
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