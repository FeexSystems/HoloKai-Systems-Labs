import dynamic from 'next/dynamic';

export const CivilizationGlobe = dynamic(
  () => import('./CivilizationGlobe').then((m) => m.CivilizationGlobe),
  { ssr: false }
);
