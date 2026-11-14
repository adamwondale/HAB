import React, { useRef, useEffect } from 'react';
import { Send, Sparkles, Brain, ArrowRight, User } from 'lucide-react';
import { CopilotChatMessage, CopilotAction } from '../../types/copilot';

interface CopilotChatTabProps {
  messages: CopilotChatMessage[];
  inputPrompt: string;
  isLoading: boolean;
  quickPrompts: string[];
  onInputChange: (val: string) => void;
  onSendMessage: (text?: string) => void;
  onExecuteAction: (action: CopilotAction) => void;
}

export const CopilotChatTab: React.FC<CopilotChatTabProps> = ({
  messages,
  inputPrompt,
  isLoading,
  quickPrompts,
  onInputChange,
  onSendMessage,
  onExecuteAction
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPrompt.trim() || isLoading) return;
    onSendMessage();
  };

  return (
    <div className="flex flex-col h-full text-xs">
      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50 dark:bg-slate-950/40">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] rounded-xl px-3.5 py-2.5 space-y-2 ${
                  isUser
                    ? 'bg-[#4C4541] text-[#FCF0DA]'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 shadow-xs'
                }`}
              >
                <div className="flex items-center gap-1.5 text-[10px] opacity-75 font-mono">
                  {isUser ? <User className="w-3 h-3" /> : <Brain className="w-3 h-3 text-[#F2C46A]" />}
                  <span>{isUser ? 'You' : 'HAB ERP Copilot'}</span>
                  <span>· {msg.timestamp}</span>
                </div>
                <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>

                {/* Suggested executable actions */}
                {!isUser && msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-1.5">
                    {msg.suggestedActions.map((act) => (
                      <button
                        key={act.id}
                        type="button"
                        onClick={() => onExecuteAction(act)}
                        className="px-2.5 py-1 rounded bg-[#FCF0DA] hover:bg-[#F6E6C5] text-[#4C4541] font-bold text-[11px] border border-[#EFE7D8] inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>{act.label}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-slate-400 p-2 italic text-xs">
            <Sparkles className="w-4 h-4 text-[#F2C46A] animate-pulse" />
            <span>Copilot is formulating operational guidance...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Instant quick inquiry prompts */}
      {quickPrompts.length > 0 && (
        <div className="p-2 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-x-auto flex gap-1.5">
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onSendMessage(p)}
              className="px-2.5 py-1 rounded-full bg-[#FCF0DA]/60 hover:bg-[#FCF0DA] text-[#4C4541] border border-[#EFE7D8] text-[10px] font-semibold whitespace-nowrap cursor-pointer transition-colors"
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Input box */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex gap-2">
        <input
          type="text"
          value={inputPrompt}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="Ask anything about leave policies, 9-column payroll, shifts, or stock..."
          disabled={isLoading}
          className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-[#F2C46A]"
        />
        <button
          type="submit"
          disabled={isLoading || !inputPrompt.trim()}
          className="px-3.5 py-2 rounded-lg bg-[#F2C46A] hover:bg-[#E5B558] disabled:opacity-50 text-[#4C4541] font-bold text-xs shadow-xs cursor-pointer inline-flex items-center gap-1"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Send</span>
        </button>
      </form>
    </div>
  );
};
