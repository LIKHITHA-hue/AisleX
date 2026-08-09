import ChatInterface from '../components/ChatInterface'
import { getSuggestedQuestions } from '../services/llmService'
import { Sparkles } from 'lucide-react'

export default function AIAssistant() {
  return (
    <div className="mx-auto flex h-[calc(100vh-140px)] max-w-4xl flex-col">
      <div className="mb-4 flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-assist-soft text-assist">
          <Sparkles size={15} />
        </div>
        <p className="text-[13px] text-muted">
          AisleX AI is powered by demo responses — connect your LLM in{' '}
          <code className="font-mono text-[12px] text-ink">llmService.js</code>
        </p>
      </div>
      <div className="min-h-0 flex-1">
        <ChatInterface suggestedQuestions={getSuggestedQuestions()} />
      </div>
    </div>
  )
}
