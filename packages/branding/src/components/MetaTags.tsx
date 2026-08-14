'use client';

/**
 * MetaTags Component - Social Media and SEO Meta Tag Generation
 * 
 * Generates Open Graph and Twitter Card meta tags for social media sharing.
 * Includes favicon link tag and handles existing meta tags to avoid duplication.
 * 
 * @example
 * ```tsx
 * <MetaTags 
 *   title="HoloKai Platform" 
 *   description="Advanced AI-powered platform for knowledge management"
 *   imageUrl="/logos/holokai-logo-horizontal.jpg"
 * />
 * ```
 */

import React from 'react';
import Head from 'next/head';
import type { MetaTagsProps } from '../types/branding';
import { defaultBrandingConfig } from '../types/branding';

/**
 * MetaTags Component
 */
export const MetaTags: React.FC<MetaTagsProps> = ({
  title = 'HoloKai Platform',
  description = 'HoloKai Systems - Advanced Platform for cross-dimensional knowledge integration',
  imageUrl,
  url,
  favicon = defaultBrandingConfig.logos.favicon,
  twitterCard = 'summary_large_image',
  additionalMetaTags = []
}) => {
  // Default to horizontal logo if no image provided
  const ogImage = imageUrl || defaultBrandingConfig.logos.horizontal;
  
  // Get current URL if not provided
  const pageUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  return (
    <Head>
      {/* Basic meta tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      
      {/* Favicon */}
      <link rel="icon" href={favicon} />
      
      {/* Open Graph meta tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:type" content="website" />
      
      {/* Twitter Card meta tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Additional meta tags */}
      {additionalMetaTags.map((meta, index) => (
        <meta
          key={index}
          {...(meta.name ? { name: meta.name } : { property: meta.property })}
          content={meta.content}
        />
      ))}
    </Head>
  );
};

export default MetaTags;
