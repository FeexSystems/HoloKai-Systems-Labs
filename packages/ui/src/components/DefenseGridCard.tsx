import React from 'react';
import { GridProductCard, type GridProductCardProps } from './ProductGrid';
import { Shield } from 'lucide-react';

export function DefenseGridCard(props: Partial<GridProductCardProps>) {
  return (
    <GridProductCard
      name="Defense Grid"
      description="Advanced telemetry, firewall rules, and threat mitigation for your assets."
      icon={<Shield size={24} />}
      {...props}
    />
  );
}
