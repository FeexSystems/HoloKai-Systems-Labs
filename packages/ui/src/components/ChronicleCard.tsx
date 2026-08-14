import React from 'react';
import { GridProductCard, type GridProductCardProps } from './ProductGrid';
import { Database } from 'lucide-react';

export function ChronicleCard(props: Partial<GridProductCardProps>) {
  return (
    <GridProductCard
      name="Chronicle (WordPress)"
      description="Managed content archives with built-in telemetry and defense grid integrations."
      icon={<Database size={24} />}
      {...props}
    />
  );
}
