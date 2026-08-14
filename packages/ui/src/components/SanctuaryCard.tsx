import React from 'react';
import { GridProductCard, type GridProductCardProps } from './ProductGrid';
import { Server } from 'lucide-react';

export function SanctuaryCard(props: Partial<GridProductCardProps>) {
  return (
    <GridProductCard
      name="Sanctuary (Hosting)"
      description="Secure, high-performance web sanctuaries for your planetary-scale applications."
      icon={<Server size={24} />}
      {...props}
    />
  );
}
