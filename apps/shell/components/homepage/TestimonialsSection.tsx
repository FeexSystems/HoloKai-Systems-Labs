'use client';

import React, { useState } from 'react';
import { TestimonialCard } from '@holokai/ui';

const TESTIMONIALS = [
  {
    id: 't1',
    quote:
      'HoloKai gave me access to Meroitic inscription databases I didn\'t know existed. The epistemic labeling is exactly what peer-reviewed research needs.',
    author: 'Dr. Amara Diallo',
    role: 'Egyptologist',
    organization: 'University of Cairo',
    rating: 5,
  },
  {
    id: 't2',
    quote:
      'The Oracle\'s ability to cross-reference oral traditions with archaeological data is unprecedented. A true paradigm shift for African historical research.',
    author: 'Prof. Kwame Asante',
    role: 'Historian',
    organization: 'University of Ghana',
    rating: 5,
  },
  {
    id: 't3',
    quote:
      'Finally, a platform that treats African civilizational history with the epistemic rigor it deserves. The confidence scores alone are worth it.',
    author: 'Nkechi Obi',
    role: 'Independent Researcher',
    organization: 'Lagos Institute of Humanities',
    rating: 5,
  },
];

export function TestimonialsSection() {
  const [current, setCurrent] = useState(0);

  return (
    <section className="py-24 md:py-32 bg-[#05050a]">
      <div className="mx-auto w-[calc(100%-32px)] max-w-[1440px] md:w-[calc(100%-48px)]">
        <div className="text-center mb-14">
          <span className="text-[10px] font-mono text-brand-light uppercase tracking-[0.2em] block mb-4">
            Researchers Speak
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Trusted by historians & scholars
          </h2>
        </div>

        {/* Grid */}
        <div className="grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <TestimonialCard key={t.id} testimonial={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
