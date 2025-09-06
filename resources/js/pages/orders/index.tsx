import { columns, Payment } from "./columns"
import { DataTable } from "./data-table"
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch } from "@/store";
import { useEffect } from 'react';
import { setOrders } from "@/store/orderSlice";
import { 
    orderListWithMeta
} from './selectors'
import { Order } from '@/types';

export default function Orders() {
    const dispatch = useDispatch<AppDispatch>();
    const orders:[Order] = useSelector(orderListWithMeta);

    const getOrders = async () => {
        try {
            const response = await fetch('/api/local-orders');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log('Bricklink orders:', data);
            return data; // Return the data for further processing
            // Handle the data as needed, e.g., set it in state
        } catch (error) {
            console.error('Error fetching Bricklink orders:', error);
            // Handle the error, e.g., show a notification
        }
    };
    
    const [data, setData] = React.useState<Payment[]>([]);

    useEffect(() => {
        getOrders().then((data) => {
            dispatch(setOrders(data));
        })
    },[])

    return (
        <AppLayout>
            <Head title="Orders" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                     <DataTable columns={columns} data={orders} />
                </div>
            </div>
        </AppLayout>
    );
}
