import { 
    Card, 
    CardContent,
    CardDescription,
    CardHeader, 
    CardTitle 
} from '@/components/ui/card';
import { Button } from "@/components/ui/button";
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';


export default function ItemCard({ inventoryOnClick, order, color, is_packed, picked_quantity, itemId, orderId, onClick, quanity, condition, img, title, category, quantityOnChange}) {
    
    const isPackedOnChange = (checked:boolean) => {
        onClick(checked, itemId);
    };

    return (
        <div className="relative aspect-video rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
            <Card className="rounded-xl">
                <CardHeader className="px-10 pt-8 pb-0">
                     <div>
                     {condition === 'N' ? (
                        <Badge className="">New</Badge>
                     ) : (
                        <Badge className="">Used</Badge>
                     )}
                     </div>
                    <div>
                        <Checkbox onCheckedChange={isPackedOnChange}/>
                        <Label htmlFor="terms">Has been packed</Label>
                     </div>
                     <div className="">
                        <img src={img} alt="Item Image" className="mx-auto mb-4 h-24 w-24 object-contain" />
                     </div>
                     <div className="flex items-center space-x-2"> {/* space-x-2 adds horizontal spacing */}
                        <Input className="w-20" type="number" min="0" max={quanity} value={picked_quantity} onChange={(quantityOnChange)} id={itemId}/>
                        <Label htmlFor="terms">Number of items picked</Label>
                    </div>
                </CardHeader>
                <CardContent className="px-10 py-8">
                    <CardDescription>
                      <CardTitle>{title}</CardTitle>
                        <label>Color: {color}</label>
                        <br/>
                        <label>Cat: {category}</label>
                        <br/>
                        <label>Qty: {quanity}</label>
                        <br/>
                        <label>Order: {order}</label>
                        <br/>
                        <Button variant="ghost" onClick={() => inventoryOnClick(itemId)}>View Store Inventory</Button>
                        <br/>
                    </CardDescription>
                </CardContent>
            </Card>
     </div>

    );
}
