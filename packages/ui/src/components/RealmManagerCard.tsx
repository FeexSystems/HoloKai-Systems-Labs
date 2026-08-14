import React from 'react';
import { GridProductCard, type GridProductCardProps } from './ProductGrid';
import { Globe } from 'lucide-react';

export function RealmManagerCard(props: Partial<GridProductCardProps>) {
  return (
    <GridProductCard
      name="Realm Manager"
      description="Oversee and configure your registered domains and planetary namespaces."
      icon={<Globe size={24} />}
      {...props}
    />
  );
}
