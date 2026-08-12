import { useEffect } from 'react'

interface SEOProps {
  title: string
  description: string
  jsonLd?: object | object[]
}

/** SPA meta management: title, description, OG tags, canonical, JSON-LD. */
export function useSEO({ title, description, jsonLd }: SEOProps) {
  useEffect(() => {
    document.title = title

    const ensure = (selector: string, create: () => HTMLElement) => {
      let el = document.head.querySelector(selector) as HTMLElement | null
      if (!el) {
        el = create()
        document.head.appendChild(el)
      }
      return el
    }

    const meta = (name: string, content: string, attr: 'name' | 'property' = 'name') => {
      const el = ensure(`meta[${attr}="${name}"]`, () => {
        const m = document.createElement('meta')
        m.setAttribute(attr, name)
        return m
      })
      el.setAttribute('content', content)
    }

    meta('description', description)
    meta('og:title', title, 'property')
    meta('og:description', description, 'property')
    meta('og:type', 'website', 'property')
    meta('og:url', window.location.href, 'property')

    const canonical = ensure('link[rel="canonical"]', () => {
      const l = document.createElement('link')
      l.setAttribute('rel', 'canonical')
      return l
    })
    canonical.setAttribute('href', window.location.origin + window.location.pathname)

    let script = document.getElementById('page-jsonld') as HTMLScriptElement | null
    if (jsonLd) {
      if (!script) {
        script = document.createElement('script')
        script.type = 'application/ld+json'
        script.id = 'page-jsonld'
        document.head.appendChild(script)
      }
      script.textContent = JSON.stringify(jsonLd)
    } else if (script) {
      script.remove()
    }
  }, [title, description, jsonLd])
}
