import React from 'react';
import { GridProductCard, type GridProductCardProps } from './ProductGrid';
import { Network } from 'lucide-react';

export function SynapseManagerCard(props: Partial<GridProductCardProps>) {
  return (
    <GridProductCard
      name="Synapse Manager"
      description="Monitor APIs, webhooks, and active integrations across your infrastructure."
      icon={<Network size={24} />}
      {...props}
    />
  );
}
