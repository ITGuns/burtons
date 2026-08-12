/**
 * Rule-based chatbot brain. Answers only from verified business facts, the
 * FAQ list, and published admin knowledge-base articles. Never invents
 * pricing, availability, financing terms or guarantees.
 */
import { BUSINESS } from './constants'
import { FAQS } from '../data/faqs'
import { SERVICES } from '../data/services'
import { listKB } from './db'
import type { KBArticle } from './types'

const FALLBACK =
  "I don't have that information yet. I can connect you with Burton's Reliable — tap “Talk to a representative” below, or call (225) 603-2253."

interface Intent {
  keywords: string[]
  answer: () => string
}

const INTENTS: Intent[] = [
  {
    keywords: ['hello', 'hey', 'good morning', 'good afternoon', 'good evening'],
    answer: () =>
      `Hi! I'm the Burton's Reliable assistant. I can help with our services, hours, service area, and booking. What can I help you with?`,
  },
  {
    keywords: ['service', 'offer', 'what do you do', 'help with'],
    answer: () =>
      `We provide complete residential and commercial HVAC services in Baton Rouge:\n\n${SERVICES.map((s) => `• ${s.title}`).join('\n')}\n\nWant me to help you request a service?`,
  },
  {
    keywords: ['price', 'cost', 'how much', 'charge', 'rate', 'fee', 'quote'],
    answer: () =>
      `Every job is different, so I can't quote exact pricing here — but Burton's Reliable offers free estimates and consultations with transparent pricing and no hidden fees. Call ${BUSINESS.phone} or use the Request Service button for a free estimate.`,
  },
  {
    keywords: ['free estimate', 'estimate', 'consultation'],
    answer: () =>
      `Yes — we offer free estimates and consultations. Use the Request Service button or call ${BUSINESS.phone} to schedule yours.`,
  },
  {
    keywords: ['area', 'baton rouge', 'where', 'location', 'serve', 'address'],
    answer: () =>
      `We're based at ${BUSINESS.address} and serve Baton Rouge and the surrounding area. Call ${BUSINESS.phone} to confirm availability at your address.`,
  },
  {
    keywords: ['hour', 'open', 'close', 'when', 'schedule'],
    answer: () =>
      `Our business hours:\n\n${BUSINESS.hours.map((h) => `• ${h.days}: ${h.hours}`).join('\n')}\n\nFor emergencies, call ${BUSINESS.phone}.`,
  },
  {
    keywords: ['emergency', 'urgent', 'broke', 'broken', 'not working', 'stopped', 'no air', 'no heat'],
    answer: () =>
      `We offer emergency HVAC services. For urgent heating or cooling failures, the fastest option is to call ${BUSINESS.phone} directly. You can also submit an emergency request through the Request Service button.`,
  },
  {
    keywords: ['financ', 'payment plan', 'pay over time', 'afford'],
    answer: () =>
      `Financing options are available. I don't have the specific terms here — call ${BUSINESS.phone} and the team will walk you through current financing for your project.`,
  },
  {
    keywords: ['book', 'appointment', 'request', 'schedule a', 'sign up', 'come out'],
    answer: () =>
      `Easy — tap the “Request Service” button (top right, or anywhere on the site), fill in your details, and Burton's Reliable will contact you shortly. Prefer the phone? Call ${BUSINESS.phone}.`,
  },
  {
    keywords: ['experience', 'how long', 'years', 'qualified', 'trust'],
    answer: () =>
      `Burton's Reliable brings ${BUSINESS.yearsExperience} years of HVAC industry experience serving Baton Rouge homes and businesses, with a customer-first, transparent approach.`,
  },
  {
    keywords: ['phone', 'call', 'number', 'contact', 'reach'],
    answer: () =>
      `You can reach Burton's Reliable at ${BUSINESS.phone}. We're at ${BUSINESS.address}.`,
  },
  {
    keywords: ['commercial', 'business', 'office', 'store'],
    answer: () =>
      `Yes — we service commercial properties as well as homes: installation, maintenance, diagnostics and repairs. Request a free consultation via the Request Service button or call ${BUSINESS.phone}.`,
  },
  {
    keywords: ['maintenance', 'tune', 'filter', 'checkup', 'winteriz'],
    answer: () =>
      `We offer preventive maintenance and winterization to keep systems efficient and catch problems early. It's one of the best ways to avoid expensive breakdowns. Want to schedule a maintenance visit?`,
  },
  {
    keywords: ['thank', 'thanks', 'great', 'awesome'],
    answer: () => `You're welcome! Anything else I can help with?`,
  },
]

function searchKB(query: string, articles: KBArticle[]): string | null {
  const words = query.toLowerCase().split(/\W+/).filter((w) => w.length > 3)
  if (!words.length) return null
  let best: { score: number; article: KBArticle } | null = null
  for (const a of articles.filter((x) => x.published)) {
    const haystack = `${a.title} ${a.category} ${a.content}`.toLowerCase()
    const score = words.reduce((acc, w) => acc + (haystack.includes(w) ? 1 : 0), 0)
    if (score >= 2 && (!best || score > best.score)) best = { score, article: a }
  }
  return best ? `${best.article.title}\n\n${best.article.content}` : null
}

export async function botReply(userText: string): Promise<string> {
  const text = userText.toLowerCase()

  for (const intent of INTENTS) {
    if (intent.keywords.some((k) => text.includes(k))) return intent.answer()
  }

  // FAQ fuzzy match
  const words = text.split(/\W+/).filter((w) => w.length > 3)
  for (const faq of FAQS) {
    const q = faq.q.toLowerCase()
    if (words.filter((w) => q.includes(w)).length >= 2) return faq.a
  }

  // Admin knowledge base
  try {
    const kb = await listKB()
    const hit = searchKB(userText, kb)
    if (hit) return hit
  } catch {
    /* KB unavailable — fall through */
  }

  return FALLBACK
}

export const SUGGESTED_QUESTIONS = [
  'What HVAC services do you offer?',
  'Do you provide free estimates?',
  'Do you offer emergency service?',
  'What are your business hours?',
  'How do I book a service?',
]
