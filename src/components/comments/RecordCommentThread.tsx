import React, { useState } from 'react';
import { MessageSquare, Send, User, Clock, Trash2 } from 'lucide-react';
import { ManagementPerson } from '../../types/hrm';

export interface RecordComment {
  id: string;
  recordId: string;
  authorName: string;
  authorRole: string;
  text: string;
  timestamp: string;
}

interface RecordCommentThreadProps {
  recordId: string;
  recordTitle?: string;
  activeUser?: ManagementPerson;
  initialComments?: RecordComment[];
}

const DEFAULT_COMMENTS: RecordComment[] = [
  {
    id: 'cmt-1',
    recordId: 'default',
    authorName: 'Ato Yohannes Bekele',
    authorRole: 'HR Operations',
    text: 'Clearance verification stage completed. Awaiting store property return confirmation.',
    timestamp: '2026-11-12 11:30 AM'
  },
  {
    id: 'cmt-2',
    recordId: 'default',
    authorName: 'W/ro Sara Tadesse',
    authorRole: 'Finance Head',
    text: 'Payroll severance calculation ready for approval pending uniform handover.',
    timestamp: '2026-11-13 02:15 PM'
  }
];

export const RecordCommentThread: React.FC<RecordCommentThreadProps> = ({
  recordId,
  recordTitle = 'Active Record',
  activeUser,
  initialComments = DEFAULT_COMMENTS
}) => {
  const [comments, setComments] = useState<RecordComment[]>(() => {
    try {
      const stored = localStorage.getItem(`hab_comments_${recordId}`);
      return stored ? JSON.parse(stored) : initialComments;
    } catch {
      return initialComments;
    }
  });
  const [newCommentText, setNewCommentText] = useState('');

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newComment: RecordComment = {
      id: `cmt-${Date.now()}`,
      recordId,
      authorName: activeUser?.name || 'Ato Yohannes Bekele',
      authorRole: activeUser?.title || 'System User',
      text: newCommentText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })
    };

    const updated = [newComment, ...comments];
    setComments(updated);
    try {
      localStorage.setItem(`hab_comments_${recordId}`, JSON.stringify(updated));
    } catch (err) {
      console.error('Failed saving comment', err);
    }
    setNewCommentText('');
  };

  const handleDeleteComment = (id: string) => {
    const updated = comments.filter((c) => c.id !== id);
    setComments(updated);
    try {
      localStorage.setItem(`hab_comments_${recordId}`, JSON.stringify(updated));
    } catch (err) {
      console.error('Failed deleting comment', err);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3 text-xs">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-[#F2C46A]" />
          <h3 className="font-bold text-[#4C4541] dark:text-slate-100">
            Comments & Audit Notes — <span className="text-slate-500 font-normal">{recordTitle}</span>
          </h3>
        </div>
        <span className="text-[10px] font-mono text-slate-400">
          {comments.length} {comments.length === 1 ? 'note' : 'notes'}
        </span>
      </div>

      {/* Input box */}
      <form onSubmit={handleAddComment} className="flex gap-2">
        <input
          type="text"
          value={newCommentText}
          onChange={(e) => setNewCommentText(e.target.value)}
          placeholder="Write an operational note or status comment..."
          className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:ring-1 focus:ring-[#F2C46A] focus:outline-none"
        />
        <button
          type="submit"
          className="px-3 py-1.5 rounded-lg bg-[#F2C46A] hover:bg-[#E5B558] text-[#4C4541] font-bold inline-flex items-center gap-1 shadow-xs cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Post</span>
        </button>
      </form>

      {/* Comment List */}
      <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
        {comments.map((c) => (
          <div
            key={c.id}
            className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 space-y-1"
          >
            <div className="flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
                <User className="w-3 h-3 text-[#4C4541]/60" />
                <span>{c.authorName}</span>
                <span className="text-[10px] text-slate-400 font-normal">({c.authorRole})</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
                <Clock className="w-3 h-3" />
                <span className="font-mono">{c.timestamp}</span>
                <button
                  type="button"
                  onClick={() => handleDeleteComment(c.id)}
                  className="hover:text-rose-600 p-0.5 cursor-pointer ml-1"
                  title="Delete note"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
            <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed pl-4">{c.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
