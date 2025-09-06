import { Card } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import ItemCard from './inventory-item-card';
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch } from "@/store";
import { useEffect } from 'react';
import { 
    setOrderItems,
    updateOrderItem,
    setViewAll,
    setViewNew,
    setViewUsed,
    setSelectedCategory,
    setFilteredOrder
} from "@/store/orderItemsSlice";
import { setCatergories } from "@/store/categorySlice";
import { setOrders } from "@/store/orderSlice";
import { Select, SelectTrigger, SelectContent, SelectValue, SelectItem } from '@/components/ui/select';
import { 
    ordersToPack, 
    categoriesInOrders, 
    allItems, 
    viewAll,
    viewNew, 
    viewUsed, 
    selectedCatergory, 
    filteredItems,
    filterdOrderId
} from './selectors'
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { OrderItem, Order } from '@/types';


export default function InventoryItem() {
    //const data = useSelector((state: RootState) => state.orders.items);
    //const categories = useSelector((state: RootState) => state.categories.data);
    const dispatch = useDispatch<AppDispatch>();
    const items:[OrderItem] = useSelector(allItems);
    const categories = useSelector(categoriesInOrders);
    const viewAllItems = useSelector(viewAll);
    const viewNewItems = useSelector(viewNew);
    const viewUsedItems = useSelector(viewUsed);
    const filteredOrderItems = useSelector(filteredItems);
    const selectedCategoryName = useSelector(selectedCatergory);
    const selectedOrder = useSelector(filterdOrderId);
    const ordersToFill:[Order] = useSelector(ordersToPack);

    const getCategories = async () => {
        try {
            const categoriesResponse = await fetch(`/api/categories`);
            if (!categoriesResponse.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await categoriesResponse.json();
            console.log('Bricklink Categroies:', data);
            return data.slice().sort((a, b) => {
                if (a.name < b.name) return -1;
                if (a.name > b.name) return 1;
                return 0;
            });
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    }

    const getOrderItems = async (orderId: String) => {
        try {
            const itemsResponse = await fetch(`/api/local-orders/${orderId}/items`);
            if (!itemsResponse.ok) {
                throw new Error('Network response was not ok');
            }
            const itemsData = await itemsResponse.json();
            console.log('order items:', itemsData);
            return itemsData; // Return the data for further processing
        } catch (error) {
            console.error('Error fetching order items:', error);
        }
    }

    const getInventories = async () => {
        try {
            const response = await fetch('/api/bricklink/inventories');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
        } catch (error) {
            console.error('Error fetching inventories:', error);
        }
    };

    const getOrders = async () => {
        try {
            const response = await fetch('/api/local-orders');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            await dispatch(setOrders(data));
            //return ordersToFill
            const newOrders = data.filter((order: { status: string }) =>
                order.status === 'PAID'
            );
            return newOrders; // Return the data for further processing
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const updateItem = async (item: OrderItem) => {
        try {
            const response = await fetch(`/api/local-orders/${item.order_id}/items/${item.id}`, {
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
            console.log('Updated item:', data);
            return data; // Return the data for further processing
        } catch (error) {
            console.error('Error updating item:', error);
        }
    };

    const handlePackedOnClick = (isPacked:boolean, itemId:string, ) => {
        const item = items.find(i => i.id == itemId);
            updateItem({ ...item, ...{ is_packed: isPacked } })
            .then((updatedItem) => {
                if (updatedItem) {
                    dispatch(updateOrderItem(updatedItem));
                }
        });
    };

    const handleQunityOnUpdate= ($event: Event) => {
        const target = $event.target;
        if (target instanceof HTMLInputElement) { // Type guard to narrow down the type
            const item = items.find(i => i.id == target.id);
            updateItem({ ...item, ...{ picked_quantity: target.value } })
            .then((updatedItem) => {
                if (updatedItem) {
                    dispatch(updateOrderItem(updatedItem));
                }
            });
        }
        
    };

    const setViewAllItems = ($event: Event) => {
        dispatch(setViewAll($event.target.checked));
    };

    const setViewNewItems = ($event: Event) => {
        dispatch(setViewNew($event.target.checked));
    };

    const setViewUsedItems = ($event: Event) => {
        dispatch(setViewUsed($event.target.checked));
    };

    const updateCategory = (value:string) => {
        console.log('Selected category:', value);
        dispatch(setSelectedCategory(value));
    };

    const updateOrderFilter = (value:string) => {
        console.log('Selected category:', value);
        dispatch(setFilteredOrder(value));
    };

    useEffect(() => {
        getInventories();
        getCategories().then((data) => setCatergories(data));
        getOrders().then((orders: Array<Object>) => {
            if (!orders || orders.length === 0) {
                console.error('No orders found');
                return;
            }
            const allOrderItemsPromises = orders.map(order => getOrderItems(order.id));
            Promise.all(allOrderItemsPromises)
                .then(async (itemsArray) => {
                    const allOrderItems = itemsArray.flat();
                    await dispatch(setOrderItems(allOrderItems));
                })
                .catch((error) => {
                    console.error('Error fetching order items:', error);
                });
        })
    }, []);

    let itemsToDisplay = filteredOrderItems || items

    return (
        <AppLayout>
            <Head title="Items To Pick" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <Card className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" >
                            <Select onValueChange={updateOrderFilter} value={selectedOrder}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Order To Pack" />
                                </SelectTrigger>
                                <SelectContent>
                                    {ordersToFill.map((order, index) => (
                                        <SelectItem value={order.id} key={index}>
                                            {order.id} - {order.total_items}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select onValueChange={updateCategory} value={selectedCategoryName}>
                                <SelectTrigger className="w-[180px]">
                                    {selectedCategoryName ? selectedCategoryName : 'All Categories'}
                                </SelectTrigger>
                                <SelectContent className="w-56" align="end">
                                    {categories.map((item, index) => (
                                        <SelectItem key={index} value={item}>
                                            <span className="flex items-center gap-2">
                                                {item}
                                            </span>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </Card>
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <div>
                            <label className="m-2 p-2 bg-gray-200 rounded">View Packed Items</label>
                            <Checkbox id="terms" />
                            <Input id="all" type="checkbox" name="viewAll" checked={viewAllItems} onClick={setViewAllItems} />
                        </div>
                        <div>
                            <label className="m-2 p-2 bg-gray-200 rounded">View New Items</label>
                            <Input id="new" type="checkbox" name="viewNew" checked={viewNewItems} onClick={setViewNewItems} />
                        </div>
                        <div>
                            <label className="m-2 p-2 bg-gray-200 rounded">View Used Items</label>
                            <Input id="used" type="checkbox" name="viewUsed" checked={viewUsedItems} onClick={setViewUsedItems} />
                        </div>
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <Card className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                </div>
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                        {itemsToDisplay.map((item:OrderItem, index: number) => (
                            <ItemCard 
                                key={index} 
                                order={item.order_id} 
                                is_packed={item.is_packed} 
                                color={item.color_name} 
                                itemId={item.id} 
                                orderId={item.order_id} 
                                quanity={item.total_quantity} 
                                picked_quantity={item.picked_quantity} 
                                condition={item.condition} 
                                img={`https://img.bricklink.com/P/${item.color_id}/${item.item_no}.jpg`} 
                                title={item.name} 
                                category={item.category_name}
                                quantityOnChange={handleQunityOnUpdate}  
                                onClick={handlePackedOnClick}/>
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
