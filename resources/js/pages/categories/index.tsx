import { columns, Payment } from "./columns"
import { DataTable } from "./data-table"
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import React from "react";
import { useEffect } from 'react';

export default function Dashboard() {
    const getOrders = async () => {
        try {
            const response = await fetch('/api/categories');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log('Categories:', data);
            return data; // Return the data for further processing
            // Handle the data as needed, e.g., set it in state
        } catch (error) {
            console.error('Error fetching Bricklink orders:', error);
            // Handle the error, e.g., show a notification
        }
    };
    
    const [data, setData] = React.useState<Payment[]>([]);

    useEffect(() => {
        getOrders().then(setData);
    }, []);

    return (
        <AppLayout>
            <Head title="Orders" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                     <DataTable columns={columns} data={data} />
                </div>
            </div>
        </AppLayout>
    );
}
