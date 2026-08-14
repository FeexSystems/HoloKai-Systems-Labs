import React from 'react';
import { GridProductCard, type GridProductCardProps } from './ProductGrid';
import { Cpu } from 'lucide-react';

export function VanguardNodeCard(props: Partial<GridProductCardProps>) {
  return (
    <GridProductCard
      name="Vanguard Node (VPS)"
      description="Dedicated computational power for resource-intensive planetary operations."
      icon={<Cpu size={24} />}
      {...props}
    />
  );
}
