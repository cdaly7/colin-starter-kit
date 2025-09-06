import React, { useState } from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { X } from 'lucide-react';
import { ApplicationOrder } from '@/types';

interface FilterHeaderProps {
  onOrderFilterChange?: (orderIds: string[]) => void;
  onNameFilterChange: (name: string) => void;
  onCategoryFilterChange: (catalogs: string[]) => void;
  onConditionFilterChange: (condition: string) => void;
  onColorFilterChange: (color: string) => void;
  onPickedFilterChange?: (showPicked: boolean) => void;
  onPackedFilterChange?: (showPacked: boolean) => void;
  availableOrders?: ApplicationOrder[];
  availableCatalogs: string[];
  selectedCategories: string[];
  selectedOrders?: string[];
  nameFilter: string;
  conditionFilter: string;
  colorFilter: string;
  showPicked?: boolean;
  showPacked?: boolean;
}

export function FilterHeader({
  onOrderFilterChange,
  onNameFilterChange,
  onCategoryFilterChange,
  onConditionFilterChange,
  onColorFilterChange,
  onPickedFilterChange,
  onPackedFilterChange,
  availableCatalogs,
  availableOrders,
  selectedCategories,
  selectedOrders,
  nameFilter,
  conditionFilter,
  colorFilter,
  showPicked,
  showPacked
}: FilterHeaderProps) {

  const conditionOptions = [
    { value: 'N', label: 'New' },
    { value: 'U', label: 'Used' }
  ];

  const handleOrderSelect = (orderId: string) => {
    if (!selectedOrders.includes(orderId)) {
      onOrderFilterChange([...selectedOrders, `${orderId}`]);
    }
  };

  const handleCategorySelect = (category: string) => {
    if (!selectedCategories.includes(category)) {
      onCategoryFilterChange([...selectedCategories, `${category}`]);
    }
  };

  const removeCategoryFilter = (categoryToRemove: string) => {
    onCategoryFilterChange(selectedCategories.filter(c => c !== categoryToRemove));
  };

  const removeOrderFilter = (orderToRemove: string) => {
    onOrderFilterChange(selectedOrders.filter(o => o !== orderToRemove));
  };

  const clearIsDisabled = nameFilter === '' && selectedCategories && selectedCategories.length === 0 && selectedOrders && selectedOrders.length === 0 && conditionFilter === '' && colorFilter === '';

  const clearAllFilters = () => {
    onCategoryFilterChange([]);
    onOrderFilterChange([]);
    // onNameFilterChange('');
    // onColorFilterChange('');
  };

  return (
    <div className="sticky top-0 z-10 bg-background border-b border-border p-4 shadow-sm">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-4 text-center">Product Management</h1>

        <div className="flex flex-col gap-4 md:flex-row md:items-end">

          {/* Order Filter */}
          { availableOrders && availableOrders.length > 0 && (
            <div className="flex-1">
              <Label htmlFor="orders-filter">Filter by Order</Label>
              <Select onValueChange={handleOrderSelect}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select order to filter..." />
                </SelectTrigger>
                <SelectContent>
                  {availableOrders
                    .map((order) => (
                      <SelectItem key={order.id} value={order.id}>
                        {order.id} - {order.is_picked ? 'Picked' : 'Not Picked'}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Category Filter */}
          <div className="flex-1">
            <Label htmlFor="catalog-filter">Filter by Category</Label>
            <Select onValueChange={handleCategorySelect}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select category to filter..." />
              </SelectTrigger>
              <SelectContent>
                {availableCatalogs
                  // .filter(catalog => !selectedCategories.includes(catalog))
                  .map((catalog) => (
                    <SelectItem key={catalog} value={catalog}>
                      {catalog}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Product Name Filter */}
          <div className="flex-1">
            <Label htmlFor="name-filter">Search by Product Name</Label>
            <Input
              id="name-filter"
              type="text"
              placeholder="Enter product name..."
              value={nameFilter}
              onChange={(e) => onNameFilterChange(e.target.value)}
              className="mt-1"
            />
          </div>

          {/* Color Filter */}
          <div className="flex-1">
            <Label htmlFor="color-filter">Search by Color</Label>
            <Input
              id="color-filter"
              type="text"
              placeholder="Enter color..."
              value={colorFilter}
              onChange={(e) => onColorFilterChange(e.target.value)}
              className="mt-1"
            />
          </div>

          {/* Condition Filter */}
          <div className="flex-1">
            <Label htmlFor="condition-filter">Filter by Condition</Label>
            <Select value={conditionFilter || undefined} onValueChange={onConditionFilterChange}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="All conditions" />
              </SelectTrigger>
              <SelectContent>
                {conditionOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Picked/Packed Filter */}
          { availableOrders && availableOrders.length > 0 && (
          <div className="flex-1">
            <Checkbox
              id="picked-filter"
              checked={showPicked}
              onCheckedChange={onPickedFilterChange}
            />
            <Label htmlFor="picked-filter">Show Picked</Label>
            <br></br>
            <Checkbox
              id="packed-filter"
              checked={showPacked}
              onCheckedChange={onPackedFilterChange}
            />
            <Label htmlFor="packed-filter">Show Packed</Label>
          </div>
          )}

          {/* Clear Filters Button */}
          <Button
            variant="outline"
            onClick={clearAllFilters}
            disabled={clearIsDisabled}
          >
            Clear All
          </Button>
        </div>

        {/* Selected Filters Display */}
        {((selectedCategories && selectedCategories.length > 0) || (selectedOrders && selectedOrders.length > 0) || conditionFilter !== '') && (
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="text-sm text-muted-foreground">Filtering by:</span>

            {/* Catalog Filters */}
            {selectedOrders && selectedOrders.map((order) => (
              <Badge key={order} variant="secondary" className="text-xs">
                {order}
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-1 h-auto p-0 text-xs hover:bg-transparent"
                  onClick={() => removeOrderFilter(order)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}

            {/* Catalog Filters */}
            {selectedCategories && selectedCategories.map((category) => (
              <Badge key={category} variant="secondary" className="text-xs">
                Cat: {category}
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-1 h-auto p-0 text-xs hover:bg-transparent"
                  onClick={() => removeCategoryFilter(category)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}

            {/* Condition Filter */}
            {conditionFilter && (
              <Badge variant="secondary" className="text-xs">
                Condition: {conditionOptions.find(opt => opt.value === conditionFilter)?.label || conditionFilter}
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-1 h-auto p-0 text-xs hover:bg-transparent"
                  onClick={() => onConditionFilterChange('')}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
}