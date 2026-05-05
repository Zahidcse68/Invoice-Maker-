import React, { useState } from 'react';
import { Client } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { Plus, Edit2, Trash2, X, Check } from 'lucide-react';

interface ClientManagerProps {
  clients: Client[];
  setClients: (clients: Client[]) => void;
  onSelectClient?: (client: Client) => void;
}

export const ClientManager: React.FC<ClientManagerProps> = ({ clients, setClients, onSelectClient }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Client>>({});

  const startEdit = (client: Client) => {
    setEditingId(client.id);
    setFormData(client);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({});
  };

  const saveEdit = () => {
    if (editingId && formData.name) {
      if (editingId === 'new') {
        const newClient = { ...formData, id: uuidv4() } as Client;
        setClients([...clients, newClient]);
      } else {
        setClients(clients.map(c => c.id === editingId ? { ...c, ...formData } as Client : c));
      }
      setEditingId(null);
      setFormData({});
    }
  };

  const deleteClient = (id: string) => {
    setClients(clients.filter(c => c.id !== id));
  };

  const startNew = () => {
    setEditingId('new');
    setFormData({ name: '', email: '', address: '', phone: '' });
  };

  return (
    <div className="bg-white p-12 shadow-2xl relative max-w-[900px] mx-auto border-t-8 border-black font-sans">
      <div className="flex justify-between items-center mb-8 border-b-2 border-black pb-4">
        <h2 className="text-[10px] uppercase font-bold text-brand-dark tracking-widest">Client Management</h2>
        <button
          onClick={startNew}
          className="bg-black text-white py-3 px-6 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-800 transition flex items-center gap-2"
        >
          <Plus size={14} /> Add Client
        </button>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-3 px-4 text-[9px] uppercase font-bold text-gray-400 tracking-widest">Name</th>
              <th className="py-3 px-4 text-[9px] uppercase font-bold text-gray-400 tracking-widest">Email</th>
              <th className="py-3 px-4 text-[9px] uppercase font-bold text-gray-400 tracking-widest">Phone</th>
              <th className="py-3 px-4 text-[9px] uppercase font-bold text-gray-400 tracking-widest">Address</th>
              <th className="py-3 px-4 text-[9px] uppercase font-bold text-gray-400 tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {editingId === 'new' && (
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <td className="py-4 px-4"><input autoFocus className="w-full border-b border-gray-200 py-2 text-sm focus:outline-none focus:border-black bg-transparent font-medium" placeholder="Name" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} /></td>
                <td className="py-4 px-4"><input className="w-full border-b border-gray-200 py-2 text-sm focus:outline-none focus:border-black bg-transparent" placeholder="Email" value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} /></td>
                <td className="py-4 px-4"><input className="w-full border-b border-gray-200 py-2 text-sm focus:outline-none focus:border-black bg-transparent" placeholder="Phone" value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} /></td>
                <td className="py-4 px-4"><input className="w-full border-b border-gray-200 py-2 text-sm focus:outline-none focus:border-black bg-transparent" placeholder="Address" value={formData.address || ''} onChange={e => setFormData({...formData, address: e.target.value})} /></td>
                <td className="py-4 px-4 text-right">
                  <div className="flex justify-end gap-3 text-xs">
                    <button onClick={saveEdit} className="uppercase font-bold tracking-widest text-brand-dark hover:text-gray-600 transition">Save</button>
                    <button onClick={cancelEdit} className="uppercase font-bold tracking-widest text-gray-400 hover:text-black transition">Cancel</button>
                  </div>
                </td>
              </tr>
            )}
            {clients.map(client => (
              editingId === client.id ? (
                <tr key={client.id} className="border-b border-gray-100 bg-gray-50/50">
                  <td className="py-4 px-4"><input autoFocus className="w-full border-b border-gray-200 py-2 text-sm focus:outline-none focus:border-black bg-transparent font-medium" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} /></td>
                  <td className="py-4 px-4"><input className="w-full border-b border-gray-200 py-2 text-sm focus:outline-none focus:border-black bg-transparent" value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} /></td>
                  <td className="py-4 px-4"><input className="w-full border-b border-gray-200 py-2 text-sm focus:outline-none focus:border-black bg-transparent" value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} /></td>
                  <td className="py-4 px-4"><input className="w-full border-b border-gray-200 py-2 text-sm focus:outline-none focus:border-black bg-transparent" value={formData.address || ''} onChange={e => setFormData({...formData, address: e.target.value})} /></td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex justify-end gap-3 text-[10px]">
                      <button onClick={saveEdit} className="uppercase font-bold tracking-widest text-brand-dark hover:text-gray-600 transition">Save</button>
                      <button onClick={cancelEdit} className="uppercase font-bold tracking-widest text-gray-400 hover:text-black transition">Cancel</button>
                    </div>
                  </td>
                </tr>
              ) : (
                <tr key={client.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors group">
                  <td className="py-5 px-4 font-serif italic text-lg text-brand-dark">{client.name}</td>
                  <td className="py-5 px-4 text-gray-600 font-medium">{client.email}</td>
                  <td className="py-5 px-4 text-gray-500">{client.phone}</td>
                  <td className="py-5 px-4 truncate max-w-[200px] text-gray-500">{client.address}</td>
                  <td className="py-5 px-4 text-right">
                    <div className="flex justify-end gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      {onSelectClient && (
                         <button onClick={() => onSelectClient(client)} className="text-[10px] uppercase font-bold tracking-widest border-b border-black text-brand-dark hover:text-gray-600 transition pb-0.5">Select</button>
                      )}
                      <button onClick={() => startEdit(client)} className="text-gray-400 hover:text-brand-dark transition"><Edit2 size={16} /></button>
                      <button onClick={() => deleteClient(client.id)} className="text-gray-400 hover:text-red-500 transition"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              )
            ))}
            {clients.length === 0 && editingId !== 'new' && (
              <tr>
                <td colSpan={5} className="py-12 text-center text-[10px] uppercase font-bold tracking-widest text-gray-400">
                  No clients yet. Add one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
