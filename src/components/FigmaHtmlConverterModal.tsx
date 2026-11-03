import React, { useState } from 'react';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Code2,
  Copy,
  Download,
  Eye,
  FileCode,
  Layers,
  Link2,
  Sparkles,
  X
} from 'lucide-react';
import { HTML_FIGMA_PAGES, HtmlFigmaPageSpec } from '../data/htmlPagesExportData';

interface FigmaHtmlConverterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FigmaHtmlConverterModal: React.FC<FigmaHtmlConverterModalProps> = ({
  isOpen,
  onClose
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [convertedSlugs, setConvertedSlugs] = useState<string[]>([]);
  const [activeViewMode, setActiveViewMode] = useState<'split-code' | 'preview' | 'self-contained'>('split-code');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentPage: HtmlFigmaPageSpec = HTML_FIGMA_PAGES[selectedIndex] || HTML_FIGMA_PAGES[0];
  const originUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const livePageUrl = `${originUrl}${currentPage.publicUrlPath}`;

  const triggerCopy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => {
        setCopiedKey(prev => (prev === key ? null : prev));
      }, 2200);
    } catch {
      // Fallback copy
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedKey(key);
      setTimeout(() => {
        setCopiedKey(prev => (prev === key ? null : prev));
      }, 2200);
    }
  };

  const triggerDownload = (filename: string, content: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const toggleConverted = (slug: string) => {
    setConvertedSlugs(prev =>
      prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
    );
  };

  const handleDownloadPairAndAdvance = () => {
    triggerDownload(`${currentPage.slug}.html`, currentPage.selfContainedHtml, 'text/html;charset=utf-8');
    setTimeout(() => {
      triggerDownload(`${currentPage.slug}.css`, currentPage.specificCss, 'text/css;charset=utf-8');
    }, 180);
    if (!convertedSlugs.includes(currentPage.slug)) {
      setConvertedSlugs(prev => [...prev, currentPage.slug]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0E1525]/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white dark:bg-slate-900 border border-[#EFE1AA] dark:border-slate-700 rounded-xl shadow-2xl w-full max-w-[1400px] h-[92vh] flex flex-col overflow-hidden text-[#0E1525] dark:text-slate-100">
        
        {/* Top Modal Header */}
        <div className="bg-[#FFF9DB] dark:bg-slate-800 border-b border-[#EFE1AA] dark:border-slate-700 px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#0E1525] text-[#EBE834] flex items-center justify-center font-bold text-xs border border-[#EBE834]/40 shrink-0">
              h2d
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-[#0E1525] dark:text-white tracking-tight">
                  Figma <span className="font-mono text-xs bg-[#0E1525] text-[#EBE834] px-2 py-0.5 rounded">html.to.design</span> One-by-One Page Converter
                </h2>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                  {convertedSlugs.length} / {HTML_FIGMA_PAGES.length} Converted
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Every ERP page has its own dedicated <code className="font-mono font-semibold">.html</code> and <code className="font-mono font-semibold">.css</code> file in <code className="font-mono">/html/</code> — convert them one by one via URL, File Drag &amp; Drop, or Code Copy.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedIndex(prev => Math.max(0, prev - 1))}
              disabled={selectedIndex === 0}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-xs font-semibold flex items-center gap-1 disabled:opacity-40 cursor-pointer hover:bg-slate-50"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Prev Page
            </button>
            <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-[#0E1525] text-[#FFF9DB]">
              Page {currentPage.step} of 15
            </span>
            <button
              type="button"
              onClick={() => setSelectedIndex(prev => Math.min(HTML_FIGMA_PAGES.length - 1, prev + 1))}
              disabled={selectedIndex === HTML_FIGMA_PAGES.length - 1}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-xs font-semibold flex items-center gap-1 disabled:opacity-40 cursor-pointer hover:bg-slate-50"
            >
              Next Page
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="ml-2 p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-black/5 dark:text-slate-300 cursor-pointer"
              aria-label="Close converter"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Body: Left 15-Page Stepper + Right Inspector */}
        <div className="flex-1 flex min-h-0 overflow-hidden">
          
          {/* Left Sidebar: 15 Pages One-by-One List */}
          <aside className="w-72 border-r border-[#EFE1AA] dark:border-slate-700 bg-[#FFFDE8] dark:bg-slate-900/90 flex flex-col shrink-0">
            <div className="p-3 border-b border-[#EFE1AA] dark:border-slate-800 flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                15 Specific HTML + CSS Files
              </span>
              <span className="text-[11px] font-mono text-amber-900 dark:text-amber-300">
                /html/*.html + *.css
              </span>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-[#EFE1AA]/60 dark:divide-slate-800">
              {HTML_FIGMA_PAGES.map((item, idx) => {
                const isSelected = idx === selectedIndex;
                const isDone = convertedSlugs.includes(item.slug);
                return (
                  <div
                    key={item.slug}
                    onClick={() => setSelectedIndex(idx)}
                    className={`p-3 flex items-start justify-between gap-2.5 cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-[#0E1525] text-[#FFF9DB]'
                        : 'hover:bg-[#FEF9C3]/60 dark:hover:bg-slate-800 text-[#0E1525] dark:text-slate-200'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`font-mono text-[11px] font-bold px-1.5 py-0.2 rounded ${
                            isSelected
                              ? 'bg-[#EBE834] text-[#0E1525]'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                          }`}
                        >
                          {item.step}
                        </span>
                        <span className="text-xs font-bold truncate">{item.title}</span>
                      </div>
                      <div
                        className={`mt-1 font-mono text-[11px] flex items-center gap-2 ${
                          isSelected ? 'text-[#EBE834]' : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        <span>{item.slug}.html</span>
                        <span>+</span>
                        <span>{item.slug}.css</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        toggleConverted(item.slug);
                      }}
                      title="Mark page as imported to Figma"
                      className={`w-5 h-5 rounded flex items-center justify-center border shrink-0 mt-0.5 cursor-pointer ${
                        isDone
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : isSelected
                          ? 'border-[#FFF9DB]/50 text-transparent hover:border-[#EBE834]'
                          : 'border-slate-300 dark:border-slate-600 text-transparent hover:border-slate-500'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </aside>

          {/* Right Workspace: Selected Page Controls + Code/Preview */}
          <div className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-slate-950">
            
            {/* Action Bar for Current File */}
            <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 flex flex-col gap-3 shrink-0">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400">
                      {currentPage.category}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="font-mono text-xs font-semibold text-slate-600 dark:text-slate-400">
                      {currentPage.htmlFile} &amp; {currentPage.cssFile}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-[#0E1525] dark:text-white mt-0.5">
                    {currentPage.step}. {currentPage.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {currentPage.description}
                  </p>
                </div>

                {/* One-by-One Download & Copy Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      triggerDownload(`${currentPage.slug}.html`, currentPage.selfContainedHtml, 'text/html;charset=utf-8');
                      if (!convertedSlugs.includes(currentPage.slug)) {
                        toggleConverted(currentPage.slug);
                      }
                    }}
                    className="px-3 py-2 rounded-lg bg-[#0E1525] hover:bg-slate-800 text-[#FFF9DB] text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-[#EBE834]" />
                    Download {currentPage.slug}.html (Ready for html.to.design)
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      triggerDownload(`${currentPage.slug}.css`, currentPage.specificCss, 'text/css;charset=utf-8')
                    }
                    className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-[#FFF9DB] text-[#0E1525] dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download {currentPage.slug}.css
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadPairAndAdvance}
                    className="px-3 py-2 rounded-lg bg-[#EBE834] hover:bg-[#dfe022] text-[#0E1525] text-xs font-bold flex items-center gap-1.5 border border-[#0E1525]/15 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Download Both (.html + .css)
                  </button>
                </div>
              </div>

              {/* Direct URL Bar for html.to.design Plugin + Mode Switcher */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 flex-1 min-w-[280px]">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 shrink-0 flex items-center gap-1">
                    <Link2 className="w-3.5 h-3.5" />
                    Plugin URL:
                  </span>
                  <code className="font-mono text-xs bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded border border-slate-200 dark:border-slate-700 text-[#0E1525] dark:text-slate-200 truncate flex-1">
                    {livePageUrl}
                  </code>
                  <button
                    type="button"
                    onClick={() => triggerCopy(livePageUrl, 'url')}
                    className="px-2.5 py-1 rounded bg-slate-900 text-white text-xs font-semibold flex items-center gap-1 shrink-0 cursor-pointer hover:bg-slate-700"
                  >
                    {copiedKey === 'url' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedKey === 'url' ? 'Copied URL!' : 'Copy URL'}
                  </button>
                </div>

                {/* View Mode Switcher */}
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => setActiveViewMode('split-code')}
                    className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
                      activeViewMode === 'split-code'
                        ? 'bg-white dark:bg-slate-900 text-[#0E1525] dark:text-white shadow-2xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    Specific HTML + Specific CSS
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveViewMode('self-contained')}
                    className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
                      activeViewMode === 'self-contained'
                        ? 'bg-white dark:bg-slate-900 text-[#0E1525] dark:text-white shadow-2xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <FileCode className="w-3.5 h-3.5" />
                    Combined HTML+CSS (Single File)
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveViewMode('preview')}
                    className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer ${
                      activeViewMode === 'preview'
                        ? 'bg-white dark:bg-slate-900 text-[#0E1525] dark:text-white shadow-2xs'
                        : 'text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Live 1440px Preview
                  </button>
                </div>
              </div>
            </div>

            {/* Content Area */}
            {activeViewMode === 'split-code' && (
              <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 min-h-0 overflow-hidden">
                
                {/* Left Column: Specific HTML Code */}
                <div className="flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden min-h-0">
                  <div className="px-4 py-2.5 bg-[#FFF9DB] dark:bg-slate-800 border-b border-[#EFE1AA] dark:border-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#0E1525] dark:text-white">
                        {currentPage.htmlFile}
                      </span>
                      <span className="text-[11px] text-slate-600 dark:text-slate-400">
                        (Links to <code className="font-mono">{currentPage.slug}.css</code>)
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => triggerCopy(currentPage.cleanHtml, 'html')}
                        className="px-2.5 py-1 rounded bg-[#0E1525] text-[#FFF9DB] text-xs font-semibold flex items-center gap-1 cursor-pointer hover:bg-slate-800"
                      >
                        {copiedKey === 'html' ? <Check className="w-3.5 h-3.5 text-[#EBE834]" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedKey === 'html' ? 'Copied HTML!' : `Copy ${currentPage.slug}.html`}
                      </button>
                    </div>
                  </div>
                  <pre className="flex-1 p-4 overflow-auto font-mono text-xs leading-relaxed text-slate-800 dark:text-slate-200 bg-slate-50/60 dark:bg-slate-950 select-all">
                    <code>{currentPage.cleanHtml}</code>
                  </pre>
                </div>

                {/* Right Column: Specific CSS Code */}
                <div className="flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden min-h-0">
                  <div className="px-4 py-2.5 bg-[#FFF9DB] dark:bg-slate-800 border-b border-[#EFE1AA] dark:border-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#0E1525] dark:text-white">
                        {currentPage.cssFile}
                      </span>
                      <span className="text-[11px] text-slate-600 dark:text-slate-400">
                        (Dedicated CSS for {currentPage.slug}.html)
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => triggerCopy(currentPage.specificCss, 'css')}
                        className="px-2.5 py-1 rounded bg-[#0E1525] text-[#FFF9DB] text-xs font-semibold flex items-center gap-1 cursor-pointer hover:bg-slate-800"
                      >
                        {copiedKey === 'css' ? <Check className="w-3.5 h-3.5 text-[#EBE834]" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedKey === 'css' ? 'Copied CSS!' : `Copy ${currentPage.slug}.css`}
                      </button>
                    </div>
                  </div>
                  <pre className="flex-1 p-4 overflow-auto font-mono text-xs leading-relaxed text-slate-800 dark:text-slate-200 bg-slate-50/60 dark:bg-slate-950 select-all">
                    <code>{currentPage.specificCss}</code>
                  </pre>
                </div>

              </div>
            )}

            {activeViewMode === 'self-contained' && (
              <div className="flex-1 flex flex-col p-4 min-h-0 overflow-hidden">
                <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden min-h-0">
                  <div className="px-4 py-2.5 bg-[#FFF9DB] dark:bg-slate-800 border-b border-[#EFE1AA] dark:border-slate-700 flex items-center justify-between">
                    <div>
                      <span className="font-mono text-xs font-bold text-[#0E1525] dark:text-white">
                        {currentPage.htmlFile} (Self-Contained with Embedded &lt;style&gt; for html.to.design)
                      </span>
                      <span className="ml-2 text-xs text-slate-600 dark:text-slate-400">
                        Best for single-file upload or pasting directly into Figma html.to.design
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => triggerCopy(currentPage.selfContainedHtml, 'bundle')}
                      className="px-3 py-1.5 rounded bg-[#0E1525] text-[#FFF9DB] text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-slate-800"
                    >
                      {copiedKey === 'bundle' ? <Check className="w-3.5 h-3.5 text-[#EBE834]" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedKey === 'bundle' ? 'Copied Full Self-Contained HTML+CSS!' : 'Copy Self-Contained HTML+CSS'}
                    </button>
                  </div>
                  <pre className="flex-1 p-4 overflow-auto font-mono text-xs leading-relaxed text-slate-800 dark:text-slate-200 bg-slate-50/60 dark:bg-slate-950 select-all">
                    <code>{currentPage.selfContainedHtml}</code>
                  </pre>
                </div>
              </div>
            )}

            {activeViewMode === 'preview' && (
              <div className="flex-1 p-4 min-h-0 overflow-hidden flex flex-col">
                <div className="flex-1 bg-white border border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden shadow-inner">
                  <iframe
                    key={currentPage.slug}
                    title={`Preview ${currentPage.title}`}
                    srcDoc={currentPage.selfContainedHtml}
                    className="w-full h-full border-0"
                  />
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};
