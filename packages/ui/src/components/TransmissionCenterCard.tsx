import React from 'react';
import { GridProductCard, type GridProductCardProps } from './ProductGrid';
import { Activity } from 'lucide-react';

export function TransmissionCenterCard(props: Partial<GridProductCardProps>) {
  return (
    <GridProductCard
      name="Transmission Center"
      description="Centralized logs and metrics for all inbound and outbound comms."
      icon={<Activity size={24} />}
      {...props}
    />
  );
}
