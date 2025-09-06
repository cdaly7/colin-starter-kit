
import { Card } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch } from "@/store";
import { useEffect } from 'react';
import { setInventories } from "@/store/bricklinkStoreSlice";
import { setCatergories, setFilters } from "./inventorySlice";
import { Select, SelectTrigger, SelectContent, SelectValue, SelectItem } from '@/components/ui/select';
import {
    uniqueInventoriesParts,
    categoriesInInventories,
    filters as filtersSelector,
    filteredInventories as dataSelector,
    bricklinkInventoryDetailLink,
    selectedCategoryName as selectedCategoryNameSelector,
    selectedPartName as selectedPartNameSelector
} from './selectors'
import { Category } from '@/types';
//import InventoryCard from '../inventory-row/inventory-row';
import { Button } from '@/components/ui/button';
import { InventoryRow } from '@/components/inventory-row';

export default function Inventory() {
    const dispatch = useDispatch<AppDispatch>();
    const categories = useSelector(categoriesInInventories);
    const filters = useSelector(filtersSelector);
    const uniqueParts = useSelector(uniqueInventoriesParts);
    const data = useSelector(dataSelector);
    const partBricklinkInventoryDetailLink = useSelector(bricklinkInventoryDetailLink);
    const selectedCategoryName = useSelector(selectedCategoryNameSelector);
    const selectedPartName = useSelector(selectedPartNameSelector);

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

    const getInventories = async () => {
        try {
            if (!filters.category) {
                return false;
            }
            let url = `/api/bricklink/inventories?category_id=${filters.category}`
            if (filters.part) {
                url += `&item_no=${filters.part}`
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

    // const updateItem = async (item: OrderItem) => {
    //     try {
    //         const response = await fetch(`/api/local-orders/${item.order_id}/items/${item.id}`, {
    //             method: 'PUT',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify(item),
    //         });
    //         if (!response.ok) {
    //             throw new Error('Network response was not ok');
    //         }
    //         const data = await response.json();
    //         console.log('Updated item:', data);
    //         return data; // Return the data for further processing
    //     } catch (error) {
    //         console.error('Error updating item:', error);
    //     }
    // };

    // const handlePackedOnClick = (isPacked: boolean, itemId: string,) => {
    //     const item = items.find(i => i.id == itemId);
    //     updateItem({ ...item, ...{ is_packed: isPacked } })
    //         .then((updatedItem) => {
    //             if (updatedItem) {
    //                 dispatch(updateOrderItem(updatedItem));
    //             }
    //         });
    // };

    // const handleQunityOnUpdate = ($event: Event) => {
    //     const target = $event.target;
    //     if (target instanceof HTMLInputElement) { // Type guard to narrow down the type
    //         const item = items.find(i => i.id == target.id);
    //         updateItem({ ...item, ...{ picked_quantity: target.value } })
    //             .then((updatedItem) => {
    //                 if (updatedItem) {
    //                     dispatch(updateOrderItem(updatedItem));
    //                 }
    //             });
    //     }
    // };

    const  setCategoryFilter = async (category: string) => {
        console.log('setCategoryFilter:', { category });
        dispatch(setFilters({ ...filters, category, part: undefined }));
    };

    const setPartFilter = async (part: string) => {
        console.log('setPartFilter:', { part });
        dispatch(setFilters({ ...filters, part }));
    };

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

    useEffect(() => {
        getCategories().then((data) => dispatch(setCatergories(data)));
    }, []);

    useEffect(() => {
        getInventories();
    }, [filters.category]);

    return (
        <AppLayout>
            <div className="h-20 z-10 w-full grid auto-rows-min gap-4 md:grid-cols-3">
                <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <Select onValueChange={setCategoryFilter} value={filters.category}>
                        <SelectTrigger className="w-[180px]">
                            { selectedCategoryName }
                        </SelectTrigger>
                        <SelectContent className="w-56" align="end">
                            <SelectItem value={undefined}>
                                All Categories
                            </SelectItem>
                            {categories.map((item: Category, index: number) => (
                                <SelectItem key={index} value={item.category_id}>
                                    <span className="flex items-center gap-2">
                                        { item.category_name }
                                    </span>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select onValueChange={setPartFilter} value={filters.part}>
                        <SelectTrigger className="w-[180px]">
                             { selectedPartName }
                        </SelectTrigger>
                        <SelectContent className="w-56" align="end">
                            <SelectItem value={undefined}>
                                All Parts
                            </SelectItem>
                            {uniqueParts.map((item, index: number) => (
                                <SelectItem key={index} value={item.no}>
                                    <span className="flex items-center gap-2">
                                        { item.name }
                                    </span>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                </div>
                <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <Card className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
                <Button asChild>
                    <a href={partBricklinkInventoryDetailLink} target="_blank">
                        View on Bricklink
                    </a>
                </Button>
            </div>
            <div className="overflow-y-auto pt-20 z-0 min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    {data.map((item) => (
                        <InventoryRow
                            id={item.inventory_id}
                            key={item.inventory_id}
                            category={item.category_id}
                            color={item.color_name} 
                            image={getItemImage(item.item.type, item.item.no, item.color_id)}
                            name={item.item.name}
                            initialCondition={item.new_or_used}
                            iniitialStockRoom={item.is_stock_room}
                            initialPrice={item.unit_price}
                            initialQuantity={item.quantity}
                            onUpdate={updateInventoryItem}
                        />
                    ))}
                </div>
            </div>
            {/* </div> */}
        </AppLayout>
    );
}
