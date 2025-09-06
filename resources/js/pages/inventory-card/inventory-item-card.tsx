import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import React, { useEffect, useState } from 'react';

type InventoryCardProps = {
    category: string,
    color: string,
    condition: string,
    id: string,
    img: string,
    isStockRoom: boolean,
    name: string,
    unit_price: string,
    quantity: number,
    updateOnClick: (id: string, data: Partial<InventoryCardProps>) => void
};

export default function InventoryItemCard({ 
    category,
    color,
    condition,
    id,
    img,
    isStockRoom,
    name,
    unit_price,
    quantity,
    updateOnClick
}: InventoryCardProps) {
    const setThisPrice = parseFloat(unit_price);
    console.log('Rendering InventoryItemCard:', { setThisPrice });

    const [localUnitPrice, setLocalUnitPrice] = useState(setThisPrice);
    const [localQuantity, setLocalQuantity] = useState(quantity);

    const handleUnitPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log('setting price to', e.target.value);
        setLocalUnitPrice(parseFloat(e.target.value));
    };

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalQuantity(parseInt(e.target.value));
    };
    console.log('Rendering InventoryItemCard:', { id, name, localUnitPrice, localQuantity, unit_price: parseFloat(unit_price), setThisPrice, quantity });

    useEffect(() => {
        console.log('localUnitPrice change:', { id, name, localUnitPrice, localQuantity, unit_price: parseFloat(unit_price), setThisPrice, quantity });
    }, [localUnitPrice]); // Effect runs when 'localUnitPrice' changes

    return (
        <div className="relative rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
            <Card className="rounded">
                <CardHeader className="px-10 pt-8 pb-0">
                    <div>
                        {condition === 'N' ? (
                            <Badge className="">New</Badge>
                        ) : (
                            <Badge className="">Used</Badge>
                        )}
                    </div>
                    <div className="h-24 w-24">
                        <img src={img} alt={name} className="mx-auto mb-4 object-contain" />
                    </div>
                    <div className="flex items-center space-x-2"> {/* space-x-2 adds horizontal spacing */}
                        <Input name="quantity" onChange={handleQuantityChange} className="w-20" type="number" min="0" value={localQuantity} defaultValue={quantity} id={id} />
                        <Label>Current Quantity</Label>
                    </div>
                    <div className="flex items-center space-x-2"> {/* space-x-2 adds horizontal spacing */}
                        <Input name="unit_price" onChange={handleUnitPriceChange} className="w-20" type="float" min="0" value={localUnitPrice} defaultValue={unit_price} id={id} />
                        <Label>Unit Price</Label>
                    </div>
                    <div>
                        <Checkbox name="stockroom" defaultChecked={isStockRoom} />
                        <Label htmlFor="stockroom">Stockroom Item</Label>
                    </div>
                </CardHeader>
                <CardContent className="px-10 py-8">
                    <CardDescription>
                        <CardTitle>{name}</CardTitle>    
                        <label>Color: {color}</label>
                        <br />
                        <label>Cat: {category}</label>
                    </CardDescription>
                </CardContent>
                <CardFooter>
                    <Button onClick={() => updateOnClick(id, { quantity: localQuantity - quantity, unit_price: localUnitPrice })}>
                        Update
                    </Button>
                </CardFooter>
            </Card>
        </div>

    );
}
