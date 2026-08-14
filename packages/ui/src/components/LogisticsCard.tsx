import React from 'react';
import { GridProductCard, type GridProductCardProps } from './ProductGrid';
import { ArrowRight } from 'lucide-react';

export function LogisticsCard(props: Partial<GridProductCardProps>) {
  return (
    <GridProductCard
      name="Logistics Engine"
      description="Manage large-scale data transfers, migrations, and payload deliveries."
      icon={<ArrowRight size={24} />}
      {...props}
    />
  );
}
