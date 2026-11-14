import React, { useState } from 'react';
import { KeyRound, RotateCcw, CheckCircle2, Eye, EyeOff, Edit2, AlertCircle } from 'lucide-react';
import { UserAccount } from '../types/hrm';
import { getStoredAccounts, updateAccount, resetToDefaults } from '../utils/authStorage';

interface UserCredentialManagerProps {
  onAccountUpdated?: () => void;
}

export const UserCredentialManager: React.FC<UserCredentialManagerProps> = ({ onAccountUpdated }) => {
  const [accounts, setAccounts] = useState<UserAccount[]>(() => getStoredAccounts());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ username: '', fullName: '', newPassword: '' });
  const [showPasswordMap, setShowPasswordMap] = useState<Record<string, boolean>>({});
  const [banner, setBanner] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const notify = (message: string, type: 'success' | 'error' = 'success') => {
    setBanner({ type, message });
    setTimeout(() => setBanner(null), 5000);
  };

  const handleStartEdit = (acc: UserAccount) => {
    setEditingId(acc.id);
    setEditForm({ username: acc.username, fullName: acc.fullName || acc.name || '', newPassword: '' });
  };

  const handleSaveEdit = (accountId: string) => {
    if (!editForm.username.trim()) return notify('Username cannot be empty.', 'error');
    const updates: Partial<UserAccount> = { username: editForm.username.trim().toLowerCase(), fullName: editForm.fullName.trim() };
    if (editForm.newPassword.trim()) updates.password = editForm.newPassword.trim();
    updateAccount(accountId, updates);
    setAccounts(getStoredAccounts());
    setEditingId(null);
    notify(`Credentials for ${updates.username} saved successfully.`);
    if (onAccountUpdated) onAccountUpdated();
  };

  const handleResetSingle = (accountId: string, username: string) => {
    updateAccount(accountId, { password: 'hab2026' });
    setAccounts(getStoredAccounts());
    notify(`Password for ${username} reset to default: hab2026`);
    if (onAccountUpdated) onAccountUpdated();
  };

  const handleResetAll = () => {
    resetToDefaults();
    setAccounts(getStoredAccounts());
    notify('All 6 system user accounts reset to default credentials (hab2026).');
    if (onAccountUpdated) onAccountUpdated();
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <h2 className="text-sm font-bold text-[#0E1525] dark:text-slate-100 flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-[#F2C46A]" />
            <span>User Credentials & Access Control</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Super Admin authority to view, change passwords, and reset credentials for all 6 core ERP accounts.
          </p>
        </div>
        <button
          type="button"
          onClick={handleResetAll}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All to Default (hab2026)</span>
        </button>
      </div>

      {banner && (
        <div className={`p-3 rounded-lg text-xs font-medium flex items-center gap-2 ${
          banner.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300' : 'bg-rose-50 text-rose-800 border border-rose-200'
        }`}>
          {banner.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
          <span>{banner.message}</span>
        </div>
      )}

      <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-x-auto">
        <table className="w-full text-left text-xs min-w-[620px]">
          <thead className="bg-[#FCF0DA] dark:bg-[#2C2724] text-[#4C4541] dark:text-slate-100 border-b border-[#EFE7D8] dark:border-slate-700 font-bold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-3 px-3">Role / Persona</th>
              <th className="py-3 px-3">Username & Email</th>
              <th className="py-3 px-3">Password</th>
              <th className="py-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {accounts.map((acc) => {
              const isEditing = editingId === acc.id;
              const isVisible = !!showPasswordMap[acc.id];
              return (
                <tr key={acc.id} className="odd:bg-white even:bg-slate-50/60 dark:odd:bg-slate-900 dark:even:bg-slate-800/40">
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-900 dark:text-slate-100">{acc.fullName || acc.name}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">{acc.roleTitle}</div>
                  </td>
                  <td className="py-3 px-3">
                    {isEditing ? (
                      <div className="space-y-1 max-w-[200px]">
                        <input type="text" value={editForm.username} onChange={(e) => setEditForm(prev => ({ ...prev, username: e.target.value }))} placeholder="username" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded px-2 py-1 text-xs" />
                        <input type="text" value={editForm.fullName} onChange={(e) => setEditForm(prev => ({ ...prev, fullName: e.target.value }))} placeholder="full name" className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded px-2 py-1 text-xs" />
                      </div>
                    ) : (
                      <>
                        <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{acc.username}</span>
                        <div className="text-[11px] text-slate-400 font-mono">{acc.email}</div>
                      </>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    {isEditing ? (
                      <input type="text" value={editForm.newPassword} onChange={(e) => setEditForm(prev => ({ ...prev, newPassword: e.target.value }))} placeholder="new password" className="w-48 bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded px-2 py-1 font-mono text-xs" />
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{isVisible ? acc.password : '••••••••'}</span>
                        <button type="button" onClick={() => setShowPasswordMap(prev => ({ ...prev, [acc.id]: !prev[acc.id] }))} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer" title={isVisible ? 'Hide password' : 'Show password'}>
                          {isVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right space-x-1.5 whitespace-nowrap">
                    {isEditing ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(acc.id)}
                          className="px-2.5 py-1 rounded bg-[#F2C46A] hover:bg-[#E5B558] text-[#4C4541] font-bold text-xs cursor-pointer"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs cursor-pointer"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => handleStartEdit(acc)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-semibold text-xs cursor-pointer"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleResetSingle(acc.id, acc.username)}
                          className="px-2.5 py-1 rounded text-rose-700 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/50 text-xs font-semibold cursor-pointer"
                          title="Reset password to hab2026"
                        >
                          Reset
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
