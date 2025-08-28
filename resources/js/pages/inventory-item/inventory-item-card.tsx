import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';


export default function InventoryItemCard({ 
    category,
    color,
    condition,
    id,
    img,
    isStockRoom,
    name,
    price, 
    quantity,
}) {
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
                    <div className="">
                        <img src={img} alt={name} className="mx-auto mb-4 h-24 w-24 object-contain" />
                    </div>
                    <div className="flex items-center space-x-2"> {/* space-x-2 adds horizontal spacing */}
                        <Input className="w-20" type="number" min="0" value={quantity} id={id} />
                        <Label>Current Quantity</Label>
                    </div>
                    <div className="flex items-center space-x-2"> {/* space-x-2 adds horizontal spacing */}
                        <Input className="w-20" type="number" min="0" value={price} id={id} />
                        <Label>Price</Label>
                    </div>
                    <div>
                        <Checkbox checked={isStockRoom}/>
                        <Label htmlFor="terms">Stockroom Item</Label>
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
            </Card>
        </div>

    );
}
