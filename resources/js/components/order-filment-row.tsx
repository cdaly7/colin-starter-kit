import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Link } from '@inertiajs/react';

interface OrderFillRowProps {
  id: string;
  image: string;
  name: string;
  category: string;
  color: string;
  orderId: string;
  orderedQuantity: number;
  initialQuantity?: number;
  initialStockRoom?: boolean;
  initialCondition?: string;
  initialPacked?: boolean;
  onUpdate?: (
    id: string,
    data: object
  ) => void;
}

export function OrderFillRow({
  id,
  image,
  name,
  category = '',
  color = '',
  orderId = '',
  orderedQuantity = 0,
  initialQuantity = 0,
  initialCondition = '',
  initialPacked = false,
  onUpdate
}: OrderFillRowProps) {
  const [quantity, setQuantity] = useState(initialQuantity);
  const [isPacked, setPacked] = useState(initialPacked);

  const handleUpdate = () => {
    if (onUpdate) {
      const data = {
        picked_quantity: quantity,
        is_packed: isPacked
      };
      onUpdate(
        id,
        data
      );
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {/* Product Image */}
          <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
            <img
              src={image}
              alt={name} />
            {/* <ImageWithFallback
              src={image}
              alt={name}
              className="h-full w-full object-cover"
            /> */}
          </div>

          {/* Product Name & Catalog */}
          <div className="min-w-0 flex-1">
            <h3 className="truncate">{name}</h3>
            <div className="mt-1 flex flex-wrap gap-1">
              <Badge variant="secondary" className="text-xs">
                Cat: {category}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                <Link href={`https://www.bricklink.com/orderDetail.asp?ID=${orderId}`}>Order ID: {orderId}
                </Link>
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {initialCondition === 'N' ? 'New' : 'Used'}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {color !== '' ? color : 'No Color'}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {color === 'brown' || color === 'light gray' || color === 'dark gray' ? 'Vintage' : ''}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                Ordered Quantity: {orderedQuantity}
              </Badge>
            </div>
          </div>

          {/* Quantity Input */}
          <div className="flex flex-col gap-1">
            <Label htmlFor={`quantity-${id}`} className="text-xs">Quantity Picked</Label>
            <Input
              id={`quantity-${id}`}
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              min="0"
              max={orderedQuantity}
              placeholder="0"
              className="w-20"
            />
          </div>

          {/* Status Checkbox */}
          <div className="flex flex-col items-center gap-1">
            <Label htmlFor={`isPacked-${id}`} className="text-xs">Is Packed</Label>
            <Checkbox
              id={`isPacked-${id}`}
              checked={isPacked}
              onCheckedChange={(checked) => setPacked(checked === true)}
            />
          </div>

          {/* Update Button */}
          <Button onClick={handleUpdate} size="sm">
            Update
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}