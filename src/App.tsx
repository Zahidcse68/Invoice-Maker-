import React, { useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { defaultInvoice } from './lib/constants';
import { Client, InvoiceDetails } from './types';
import { InvoiceEditor } from './components/InvoiceEditor';
import { InvoicePreview } from './components/InvoicePreview';
import { ClientManager } from './components/ClientManager';
import { FileText, Users, Eye, Receipt } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'editor' | 'preview' | 'clients'>('editor');
  const [clients, setClients] = useLocalStorage<Client[]>('invoiceCraft_clients', []);
  const [invoice, setInvoice] = useLocalStorage<InvoiceDetails>('invoiceCraft_currentInvoice', defaultInvoice);

  const resetInvoice = () => {
    if (confirm('Are you sure you want to reset the invoice? All current changes will be lost.')) {
      setInvoice({ ...defaultInvoice, invoiceNumber: `INV-${new Date().getTime().toString().slice(-6)}` });
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-dark font-sans flex flex-col">
      {/* Top Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="w-full px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-orange-500"></div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#1A1A1A]">Invoice Studio</span>
            </div>
            
            <div className="flex gap-6 h-full items-end pb-3">
              <button 
                onClick={() => setActiveTab('editor')}
                className={`text-xs font-bold uppercase tracking-tight transition-colors ${activeTab === 'editor' ? 'border-b-2 border-black pb-1 text-[#1A1A1A]' : 'text-gray-400 pb-1.5 hover:text-[#1A1A1A]'}`}
              >
                Data Entry
              </button>
              <button 
                onClick={() => setActiveTab('preview')}
                className={`text-xs font-bold uppercase tracking-tight transition-colors ${activeTab === 'preview' ? 'border-b-2 border-black pb-1 text-[#1A1A1A]' : 'text-gray-400 pb-1.5 hover:text-[#1A1A1A]'}`}
              >
                Layout View
              </button>
              <button 
                onClick={() => setActiveTab('clients')}
                className={`text-xs font-bold uppercase tracking-tight transition-colors ${activeTab === 'clients' ? 'border-b-2 border-black pb-1 text-[#1A1A1A]' : 'text-gray-400 pb-1.5 hover:text-[#1A1A1A]'}`}
              >
                Clients
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-[1280px] w-full mx-auto px-8 py-10">
        <div className="flex justify-between items-end mb-10 pb-4 border-b border-gray-200">
          <h1 className="text-3xl font-serif italic font-black text-[#1A1A1A]">
            {activeTab === 'editor' && 'Edit Document'}
            {activeTab === 'preview' && 'Print Preview'}
            {activeTab === 'clients' && 'Client Roster'}
          </h1>
          {activeTab !== 'clients' && (
             <button onClick={resetInvoice} className="text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-black transition">
               New Document
             </button>
          )}
        </div>

        {activeTab === 'editor' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <InvoiceEditor 
              invoice={invoice} 
              setInvoice={setInvoice} 
              clients={clients} 
              onSelectClientOption={() => setActiveTab('clients')} 
            />
          </div>
        )}
        
        {activeTab === 'preview' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 overflow-x-auto pb-8">
            <InvoicePreview invoice={invoice} />
          </div>
        )}

        {activeTab === 'clients' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <ClientManager 
              clients={clients} 
              setClients={setClients} 
              onSelectClient={(client) => {
                setInvoice({
                  ...invoice,
                  clientId: client.id,
                  clientName: client.name,
                  clientEmail: client.email,
                  clientAddress: client.address,
                  clientPhone: client.phone,
                });
                setActiveTab('editor');
              }}
            />
          </div>
        )}
      </main>
    </div>
  );
}

