import { columns, OrderItem } from "./columns"
import { DataTable } from "./data-table"
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import React from "react";
import { useEffect } from 'react';

export default function Items() {
    
    const getOrderItems = async (orderId: String) => {
        try {
            const itemsResponse = await fetch(`/api/local-orders/${orderId}/items`);
            if (!itemsResponse.ok) {
                throw new Error('Network response was not ok');
            }
            const itemsData = await itemsResponse.json();
            console.log('Bricklink items:', itemsData);

            return itemsData; // Return the data for further processing
        } catch (error) {
            console.error('Error fetching Bricklink items:', error);            
        }
    }

    const getOrders = async () => {
        try {
            const response = await fetch('/api/local-orders');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            const newOrders = data.filter((order: { status: string }) => 
                order.status === 'PAID' || order.status === 'PROCESSING'
            );
            return newOrders; // Return the data for further processing
        } catch (error) {
            console.error('Error fetching Bricklink orders:', error);
            // Handle the error, e.g., show a notification
        }
    };

    const [data, setData] = React.useState<OrderItem[]>([]);

    useEffect(() => {
        getOrders().then((orders) => {
            if (!orders || orders.length === 0) {
                console.error('No orders found');
                return;
            }
            const allOrderItemsPromises = orders.map(order => getOrderItems(order.id));
            Promise.all(allOrderItemsPromises)
            .then((itemsArray) => {
                // const items = itemsArray.map(item => item !== undefined);
                setData(itemsArray.flat());
            })
            .catch((error) => {
                console.error('Error fetching order items:', error);
            });
        })
    }, []);

    return (
        <AppLayout>
            <Head title="Order Items" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                     <DataTable columns={columns} data={data} />
                </div>
            </div>
        </AppLayout>
    );
}
