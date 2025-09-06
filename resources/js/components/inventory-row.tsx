import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
//import { ImageWithFallback } from './figma/ImageWithFallback';

interface ProductCardProps {
  id: string;
  image: string;
  name: string;
  catalog: string[];
  color: string;
  initialQuantity?: number;
  initialPrice?: number;
  initialStockRoom?: boolean;
  initialCondition?: string;
  onUpdate?: (data: {
    id: string;
    quantity: number;
    price: number;
    status: boolean;
  }) => void;
}

export function InventoryRow({
  id,
  image,
  name,
  catalog,
  color = '',
  initialQuantity = 0,
  initialPrice = 0,
  initialStockRoom = false,
  initialCondition = '',
  onUpdate
}: ProductCardProps) {
  const [quantity, setQuantity] = useState(initialQuantity);
  const [price, setPrice] = useState(initialPrice);
  const [status, setStatus] = useState(initialStockRoom);
  const [condition, setCondition] = useState(initialCondition);

  const handleUpdate = () => {
    if (onUpdate) {
      const data = {
        quantity: quantity - initialQuantity,
        price,
        status
      }
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
              alt={name}
              className="" />
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
                {catalog}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {initialCondition === 'N' ? 'New' : 'Used'}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {color}
              </Badge>
            </div>
          </div>

          {/* Quantity Input */}
          <div className="flex flex-col gap-1">
            <Label htmlFor={`quantity-${id}`} className="text-xs">Quantity</Label>
            <Input
              id={`quantity-${id}`}
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              min="0"
              placeholder="0"
              className="w-20"
            />
          </div>

          {/* Price Input */}
          <div className="flex flex-col gap-1">
            <Label htmlFor={`price-${id}`} className="text-xs">Price</Label>
            <Input
              id={`price-${id}`}
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              min="0"
              step="0.01"
              placeholder="0.00"
              className="w-24"
            />
          </div>

          {/* Status Checkbox */}
          <div className="flex flex-col items-center gap-1">
            <Label htmlFor={`status-${id}`} className="text-xs">Stockroom</Label>
            <Checkbox
              id={`status-${id}`}
              checked={status}
              onCheckedChange={(checked) => setStatus(checked === true)}
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