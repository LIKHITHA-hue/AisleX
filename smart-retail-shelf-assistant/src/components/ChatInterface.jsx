import { useEffect, useRef, useState } from 'react'
import { Send, Sparkles, User } from 'lucide-react'
import RecommendationCard from './RecommendationCard'
import { sendMessageToLLM } from '../services/llmService'
import { getProductById } from '../services/productService'
import { saveQuery } from '../services/historyService'
import { useAuth } from '../hooks/useAuth'

const initialMessages = [
  {
    id: 'm0',
    role: 'assistant',
    text: "Hi! I'm AisleX AI, your shopping assistant. Ask me about a product on the shelf, or tell me what you're looking for.",
    productIds: [],
  },
]

export default function ChatInterface({ suggestedQuestions = [] }) {
  const { user } = useAuth()
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState('')
  const [pending, setPending] = useState(false)
  const [productMap, setProductMap] = useState({})
  const scrollRef = useRef(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, pending])

  async function resolveProducts(ids) {
    const missing = ids.filter((id) => !productMap[id])
    if (missing.length === 0) return
    const results = await Promise.all(missing.map((id) => getProductById(id)))
    setProductMap((prev) => {
      const next = { ...prev }
      results.forEach((p) => p && (next[p.id] = p))
      return next
    })
  }

  async function handleSend(text) {
    const trimmed = text.trim()
    if (!trimmed || pending) return
    const userMsg = { id: crypto.randomUUID(), role: 'user', text: trimmed, productIds: [] }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setPending(true)
    try {
      const res = await sendMessageToLLM(trimmed, messages)
      await resolveProducts(res.productIds ?? [])
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: 'assistant', text: res.text, productIds: res.productIds ?? [] },
      ])
      if (user) {
        saveQuery(user.email, { question: trimmed, answer: res.text, productIds: res.productIds ?? [] })
      }
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-surface">
      <div ref={scrollRef} className="flex-1 space-y-5 overflow-y-auto px-5 py-6">
        {messages.map((m) => (
          <div key={m.id} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                m.role === 'user' ? 'bg-ink text-white' : 'bg-assist-soft text-assist'
              }`}
            >
              {m.role === 'user' ? <User size={14} /> : <Sparkles size={14} />}
            </div>
            <div className={`flex max-w-[80%] flex-col gap-2.5 ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div
                className={`rounded-2xl px-4 py-2.5 text-[13.5px] leading-relaxed ${
                  m.role === 'user'
                    ? 'rounded-tr-sm bg-ink text-white'
                    : 'rounded-tl-sm bg-slate text-ink'
                }`}
              >
                {m.text}
              </div>
              {m.productIds?.length > 0 && (
                <div className="flex w-full max-w-full gap-2.5 overflow-x-auto pb-1">
                  {m.productIds.map((id) => (
                    <RecommendationCard key={id} product={productMap[id]} />
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {pending && (
          <div className="flex gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-assist-soft text-assist">
              <Sparkles size={14} />
            </div>
            <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-slate px-4 py-3">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="animate-pulse-dot h-1.5 w-1.5 rounded-full bg-muted"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {messages.length <= 1 && suggestedQuestions.length > 0 && (
        <div className="flex flex-wrap gap-2 border-t border-border px-5 py-3">
          {suggestedQuestions.map((q) => (
            <button
              key={q}
              onClick={() => handleSend(q)}
              className="focus-ring rounded-full border border-border px-3 py-1.5 text-[12px] text-muted transition-colors hover:border-assist/40 hover:bg-assist-soft hover:text-assist"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSend(input)
        }}
        className="flex items-center gap-2 border-t border-border p-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about a product, alternative, or availability…"
          className="focus-ring flex-1 rounded-lg border border-border bg-slate px-3.5 py-2.5 text-[13.5px] text-ink placeholder:text-muted"
        />
        <button
          type="submit"
          disabled={!input.trim() || pending}
          aria-label="Send message"
          className="focus-ring flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-assist text-white transition-opacity disabled:opacity-40"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  )
}
