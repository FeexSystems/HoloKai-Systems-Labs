'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  {
    id: '1',
    question: 'What is HoloKai?',
    answer: 'HoloKai is an intelligent platform for historical research, featuring AI-powered tools for accessing ancient texts, voice synthesis in ancient languages, artifact generation, and intelligent knowledge queries. It\'s designed for researchers, historians, and content creators.',
  },
  {
    id: '2',
    question: 'How does the Research Tier work?',
    answer: 'The Research Tier provides access to a comprehensive knowledge base with ancient texts, historical analysis, and research tools. You can search through thousands of documents, get context-aware answers, and access scholarly articles about ancient civilizations.',
  },
  {
    id: '3',
    question: 'Can I use HoloKai for academic research?',
    answer: 'Absolutely! HoloKai is designed for academic research with proper citation support, source verification, and access to peer-reviewed content. Many universities and research institutions use our platform for their historical studies.',
  },
  {
    id: '4',
    question: 'What languages does the voice synthesis support?',
    answer: 'HoloKai Voice Services support ancient languages including Latin, Ancient Greek, Sanskrit, Ancient Egyptian (Coptic), Old Norse, and more. We also support custom voice cloning for specific historical figures.',
  },
  {
    id: '5',
    question: 'How accurate are the AI-generated artifacts?',
    answer: 'Our Vision AI is trained on extensive archaeological data and historical records. While generated artifacts are for educational and creative purposes, they maintain high historical accuracy based on available evidence. We recommend using them alongside verified sources.',
  },
  {
    id: '6',
    question: 'What is the difference between Free, Pro, and Enterprise?',
    answer: 'Free tier includes basic queries and limited document storage. Pro tier adds voice synthesis, image generation, and API access. Enterprise tier includes unlimited everything, dedicated support, custom integrations, and team collaboration features.',
  },
  {
    id: '7',
    question: 'Can I cancel my subscription anytime?',
    answer: 'Yes, you can cancel your subscription at any time. Your access will continue until the end of your current billing period. We also offer the ability to pause subscriptions for Pro and Enterprise users.',
  },
  {
    id: '8',
    question: 'Is my data secure?',
    answer: 'Security is our top priority. We use bank-grade encryption, comply with data protection regulations (GDPR, CCPA), and offer tier-based access controls. Enterprise users get additional security features including SSO and audit logs.',
  },
  {
    id: '9',
    question: 'How does the Oracle feature work?',
    answer: 'The Oracle uses advanced AI with multi-step reasoning to answer your historical questions. It understands context, can follow up on previous queries, and provides cited sources. It\'s like having a historian available 24/7.',
  },
  {
    id: '10',
    question: 'Can I upload my own documents?',
    answer: 'Yes! The Archive feature allows you to upload your own research documents, which will be indexed and searchable. Version history is automatically maintained, and you can organize documents with tags and metadata.',
  },
  {
    id: '11',
    question: 'Do you offer API access?',
    answer: 'API access is available for Pro and Enterprise tiers. Our REST API allows you to integrate HoloKai\'s capabilities into your own applications, including knowledge queries, voice synthesis, and image generation.',
  },
  {
    id: '12',
    question: 'How do I get started?',
    answer: 'Getting started is easy! Sign up for a Free account to explore basic features. When you\'re ready for more capabilities, upgrade to Pro. For teams and organizations, contact us about Enterprise solutions with custom pricing.',
  },
];

interface FAQItemProps {
  faq: typeof faqs[0];
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}

function FAQItem({ faq, isOpen, onToggle, index }: FAQItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="border border-white/10 rounded-xl overflow-hidden bg-[#12121a]"
    >
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <HelpCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
          <span className="font-medium text-white">{faq.question}</span>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-zinc-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-4 text-zinc-400 text-sm leading-relaxed">
              {faq.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="px-6 py-24 max-w-4xl mx-auto">
      <div className="mb-16 text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-zinc-400 max-w-2xl mx-auto">
          Everything you need to know about HoloKai
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <FAQItem
            key={faq.id}
            faq={faq}
            isOpen={openIndex === index}
            onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            index={index}
          />
        ))}
      </div>

      {/* Still have questions CTA */}
      <div className="mt-12 text-center">
        <p className="text-zinc-400 mb-4">Still have questions?</p>
        <a
          href="/contact"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium hover:from-amber-600 hover:to-amber-700 transition-colors"
        >
          Contact Support
          <ChevronDown className="w-4 h-4 rotate-90" />
        </a>
      </div>
    </section>
  );
}
