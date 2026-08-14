import React from 'react';
import { GridProductCard, type GridProductCardProps } from './ProductGrid';
import { Database } from 'lucide-react';

export function ArchiveCard(props: Partial<GridProductCardProps>) {
  return (
    <GridProductCard
      name="Archive Library"
      description="Access your historical backups, saved configurations, and telemetry data."
      icon={<Database size={24} />}
      {...props}
    />
  );
}
