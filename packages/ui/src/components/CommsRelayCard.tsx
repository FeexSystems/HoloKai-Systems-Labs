import React from 'react';
import { GridProductCard, type GridProductCardProps } from './ProductGrid';
import { Mail } from 'lucide-react';

export function CommsRelayCard(props: Partial<GridProductCardProps>) {
  return (
    <GridProductCard
      name="Comms Relay (Email)"
      description="Encrypted, edge-native transmission relays for secure civilization-wide communication."
      icon={<Mail size={24} />}
      {...props}
    />
  );
}
