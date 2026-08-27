import React, { useRef } from 'react';
import { InvoiceDetails, Client, InvoiceItem } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { Plus, Trash2, Upload, Users, Image as ImageIcon, X } from 'lucide-react';

interface InvoiceEditorProps {
  invoice: InvoiceDetails;
  setInvoice: (invoice: InvoiceDetails) => void;
  clients: Client[];
  onSelectClientOption: () => void;
}

export const InvoiceEditor: React.FC<InvoiceEditorProps> = ({ invoice, setInvoice, clients, onSelectClientOption }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateField = (field: keyof InvoiceDetails, value: any) => {
    setInvoice({ ...invoice, [field]: value });
  };

  const handleClientSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    if (id === '') {
      setInvoice({
        ...invoice,
        clientId: null,
      });
      return;
    }
    const client = clients.find(c => c.id === id);
    if (client) {
      setInvoice({
        ...invoice,
        clientId: client.id,
        clientName: client.name,
        clientEmail: client.email,
        clientAddress: client.address,
        clientPhone: client.phone,
      });
    }
  };

  const handleLetterheadUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateField('letterheadUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLetterhead = () => {
    updateField('letterheadUrl', null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const signatureInputRef = useRef<HTMLInputElement>(null);
  const qrCodeInputRef = useRef<HTMLInputElement>(null);

  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateField('signatureUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleQrCodeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateField('qrCodeUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeSignature = () => {
    updateField('signatureUrl', null);
    if (signatureInputRef.current) signatureInputRef.current.value = '';
  };

  const removeQrCode = () => {
    updateField('qrCodeUrl', null);
    if (qrCodeInputRef.current) qrCodeInputRef.current.value = '';
  };

  const addItem = () => {
    setInvoice({
      ...invoice,
      items: [...(invoice.items || []), { id: uuidv4(), description: '', quantity: 1, rate: 0, unit: '', hsn: '' }]
    });
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setInvoice({
      ...invoice,
      items: (invoice.items || []).map(item => item.id === id ? { ...item, [field]: value } : item)
    });
  };

  const removeItem = (id: string) => {
    setInvoice({
      ...invoice,
      items: (invoice.items || []).filter(item => item.id !== id)
    });
  };

  return (
    <div className="bg-white p-12 shadow-2xl flex flex-col gap-12 relative max-w-[900px] mx-auto border-t-8 border-black font-sans">
      {/* Letterhead Upload & Positioning */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div>
          <h3 className="text-[10px] uppercase font-bold text-gray-400 mb-4 tracking-widest flex items-center gap-2"><ImageIcon size={14} /> Letterhead Background</h3>
          <div className="border border-gray-200 p-8 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition relative min-h-[160px]">
            {invoice.letterheadUrl ? (
              <div className="relative w-full flex justify-center">
                <img src={invoice.letterheadUrl} alt="Letterhead Preview" className="max-h-32 object-contain" />
                <button onClick={removeLetterhead} className="absolute -top-4 -right-4 p-2 bg-black text-white hover:bg-gray-800 shadow-md transition">
                  <X size={14} />
                </button>
              </div>
            ) : (
              <>
                <p className="text-xs text-gray-400 mb-4 font-bold uppercase tracking-widest">Upload Letterhead Image</p>
                <button onClick={() => fileInputRef.current?.click()} className="text-xs font-bold uppercase border border-gray-200 px-6 py-2 hover:bg-black hover:text-white transition tracking-widest">Browse Files</button>
                <input type="file" ref={fileInputRef} onChange={handleLetterheadUpload} accept="image/*" className="hidden" />
              </>
            )}
          </div>
        </div>
        
        <div>
          <h3 className="text-[10px] uppercase font-bold text-gray-400 mb-4 tracking-widest">Content Positioning (px)</h3>
          <div className="grid grid-cols-2 gap-4 border border-gray-200 p-6 bg-gray-50/50">
             <div>
               <div className="flex justify-between mb-2">
                 <label className="block text-[9px] uppercase font-bold text-gray-500 tracking-widest">Top Margin</label>
                 <span className="text-[9px] text-gray-400 font-mono">{invoice.contentPadding?.top ?? 64}px</span>
               </div>
               <input type="range" min="0" max="600" className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black" 
                      value={invoice.contentPadding?.top ?? 64} onChange={e => updateField('contentPadding', { ...(invoice.contentPadding || { top: 64, right: 64, bottom: 64, left: 64 }), top: Number(e.target.value) })} />
             </div>
             <div>
               <div className="flex justify-between mb-2">
                 <label className="block text-[9px] uppercase font-bold text-gray-500 tracking-widest">Bottom Margin</label>
                 <span className="text-[9px] text-gray-400 font-mono">{invoice.contentPadding?.bottom ?? 64}px</span>
               </div>
               <input type="range" min="0" max="600" className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black" 
                      value={invoice.contentPadding?.bottom ?? 64} onChange={e => updateField('contentPadding', { ...(invoice.contentPadding || { top: 64, right: 64, bottom: 64, left: 64 }), bottom: Number(e.target.value) })} />
             </div>
             <div>
               <div className="flex justify-between mb-2">
                 <label className="block text-[9px] uppercase font-bold text-gray-500 tracking-widest">Left Margin</label>
                 <span className="text-[9px] text-gray-400 font-mono">{invoice.contentPadding?.left ?? 64}px</span>
               </div>
               <input type="range" min="0" max="600" className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black" 
                      value={invoice.contentPadding?.left ?? 64} onChange={e => updateField('contentPadding', { ...(invoice.contentPadding || { top: 64, right: 64, bottom: 64, left: 64 }), left: Number(e.target.value) })} />
             </div>
             <div>
               <div className="flex justify-between mb-2">
                 <label className="block text-[9px] uppercase font-bold text-gray-500 tracking-widest">Right Margin</label>
                 <span className="text-[9px] text-gray-400 font-mono">{invoice.contentPadding?.right ?? 64}px</span>
               </div>
               <input type="range" min="0" max="600" className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black" 
                      value={invoice.contentPadding?.right ?? 64} onChange={e => updateField('contentPadding', { ...(invoice.contentPadding || { top: 64, right: 64, bottom: 64, left: 64 }), right: Number(e.target.value) })} />
             </div>
          </div>
        </div>
      </section>

      {/* Theme Settings */}
      <section className="mb-4">
        <h3 className="text-[10px] uppercase font-bold text-gray-400 mb-4 tracking-widest flex items-center gap-2">Brand Color</h3>
        <div className="flex items-center gap-4 border border-gray-200 p-4">
          <input 
            type="color" 
            className="w-12 h-12 cursor-pointer border-0 p-0 rounded-none bg-transparent" 
            value={invoice.themeColor || '#0033cc'} 
            onChange={(e) => updateField('themeColor', e.target.value)} 
          />
          <div className="text-xs font-mono text-gray-500 uppercase">{invoice.themeColor || '#0033cc'}</div>
        </div>
      </section>

      {/* Basic Info */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1 tracking-widest">Invoice No.</label>
          <input className="w-full border-b border-gray-200 py-2 text-sm focus:outline-none focus:border-black bg-transparent font-medium text-brand-dark transition-colors" 
                 value={invoice.invoiceNumber} onChange={(e) => updateField('invoiceNumber', e.target.value)} />
        </div>
        <div className="flex gap-4">
           <div className="flex-1">
             <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1 tracking-widest">Date Issued</label>
             <input type="date" className="w-full border-b border-gray-200 py-2 text-sm focus:outline-none focus:border-black bg-transparent font-medium text-brand-dark transition-colors" 
                   value={invoice.date} onChange={(e) => updateField('date', e.target.value)} />
           </div>
           <div className="flex-1">
             <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1 tracking-widest">Due Date</label>
             <input type="date" className="w-full border-b border-gray-200 py-2 text-sm focus:outline-none focus:border-black bg-transparent font-medium text-brand-dark transition-colors" 
                   value={invoice.dueDate} onChange={(e) => updateField('dueDate', e.target.value)} />
           </div>
        </div>
      </section>

      {/* Bill To */}
      <section className="grid grid-cols-1 gap-12">
        <div className="space-y-6">
           <div className="flex justify-between items-end border-b-2 border-black pb-2">
             <h3 className="text-[10px] uppercase font-bold text-brand-dark tracking-widest">Bill To</h3>
             <div className="flex items-center gap-3">
                <select className="text-[10px] uppercase font-bold tracking-widest text-gray-500 bg-transparent border-b border-gray-200 focus:outline-none cursor-pointer" value={invoice.clientId || ''} onChange={handleClientSelect}>
                  <option value="">Custom Client</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <button onClick={onSelectClientOption} className="text-gray-400 hover:text-black transition" title="Manage Clients">
                   <Users size={14} />
                </button>
             </div>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="space-y-4">
               <input placeholder="Client Name" className="w-full border-b border-gray-200 py-2 text-sm focus:outline-none focus:border-black bg-transparent italic font-serif text-xl" 
                   value={invoice.clientName} onChange={e => updateField('clientName', e.target.value)} />
               <input placeholder="Client Email" className="w-full border-b border-gray-200 py-2 text-sm focus:outline-none focus:border-black bg-transparent" 
                   value={invoice.clientEmail} onChange={e => updateField('clientEmail', e.target.value)} />
             </div>
             <div className="space-y-4">
               <input placeholder="Client Phone" className="w-full border-b border-gray-200 py-2 text-sm focus:outline-none focus:border-black bg-transparent" 
                   value={invoice.clientPhone} onChange={e => updateField('clientPhone', e.target.value)} />
               <textarea placeholder="Client Address" className="w-full border-b border-gray-200 py-2 text-sm focus:outline-none focus:border-black bg-transparent resize-none h-16" 
                   value={invoice.clientAddress} onChange={e => updateField('clientAddress', e.target.value)} />
             </div>
           </div>
        </div>
      </section>

      {/* Items Table */}
      <section>
        <div className="flex justify-between items-end border-b-2 border-black pb-2 mb-4">
          <h3 className="text-[10px] uppercase font-bold text-brand-dark tracking-widest">Line Items</h3>
          <button onClick={addItem} className="text-[10px] uppercase font-bold flex items-center gap-1 hover:text-gray-500 transition tracking-widest">
            <Plus size={12} /> Add Item
          </button>
        </div>
        
         <div className="w-full">
           <table className="w-full">
             <thead>
               <tr className="border-b border-gray-100">
                  <th className="text-left py-2 text-[9px] uppercase font-bold text-gray-400 w-12 tracking-widest">No.</th>
                  <th className="text-left py-2 text-[9px] uppercase font-bold text-gray-400 tracking-widest">Description</th>
                  <th className="text-left py-2 text-[9px] uppercase font-bold text-gray-400 w-24 tracking-widest">HSN</th>
                  <th className="text-right py-2 text-[9px] uppercase font-bold text-gray-400 w-20 tracking-widest">Qty</th>
                  <th className="text-right py-2 text-[9px] uppercase font-bold text-gray-400 w-20 tracking-widest">Unit</th>
                  <th className="text-right py-2 text-[9px] uppercase font-bold text-gray-400 w-28 tracking-widest">Rate</th>
                  <th className="text-center py-2 text-[9px] uppercase font-bold text-gray-400 w-10"></th>
               </tr>
             </thead>
             <tbody className="text-sm">
                {(invoice.items || []).map((item, index) => (
                   <tr key={item.id} className="border-b border-gray-50 group">
                      <td className="py-3 font-mono text-gray-400 text-xs">{(index + 1).toString().padStart(2, '0')}</td>
                      <td className="py-3 pr-2">
                         <input className="w-full bg-transparent outline-none focus:border-b focus:border-gray-300 font-medium pb-1" placeholder="Item description" 
                                value={item.description} onChange={e => updateItem(item.id, 'description', e.target.value)} />
                      </td>
                      <td className="py-3 pr-2">
                         <input className="w-full bg-transparent outline-none focus:border-b focus:border-gray-300 font-medium pb-1" placeholder="HSN/SAC" 
                                value={item.hsn || ''} onChange={e => updateItem(item.id, 'hsn', e.target.value)} />
                      </td>
                      <td className="py-3 pr-2">
                         <input type="number" min="1" className="w-full bg-transparent outline-none text-right focus:border-b focus:border-gray-300 pb-1" 
                                value={item.quantity} onChange={e => updateItem(item.id, 'quantity', Number(e.target.value))} />
                      </td>
                      <td className="py-3 pr-2">
                         <input className="w-full bg-transparent outline-none text-right focus:border-b focus:border-gray-300 pb-1" placeholder="Unit"
                                value={item.unit || ''} onChange={e => updateItem(item.id, 'unit', e.target.value)} />
                      </td>
                      <td className="py-3 flex items-center justify-end group-focus-within:border-b border-gray-300 pb-1 mt-[11px] h-[32px]">
                         <span className="text-gray-400 mr-1 text-xs">{invoice.currency}</span>
                         <input type="number" min="0" step="0.01" className="w-full bg-transparent outline-none text-right" 
                                value={item.rate} onChange={e => updateItem(item.id, 'rate', Number(e.target.value))} />
                      </td>
                      <td className="py-3 text-center">
                         <button onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-black transition p-1">
                           <Trash2 size={14} />
                         </button>
                      </td>
                   </tr>
                ))}
             </tbody>
           </table>
        </div>
      </section>

      {/* Config & Notes */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8 border-t border-gray-100">
         <div className="space-y-6">
             <div className="grid grid-cols-3 gap-6">
               <div>
                 <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1 tracking-widest">Currency</label>
                 <input className="w-full border-b border-gray-200 py-2 text-sm focus:outline-none focus:border-black bg-transparent font-medium" 
                        value={invoice.currency} onChange={e => updateField('currency', e.target.value)} />
               </div>
               <div>
                 <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1 tracking-widest">Tax %</label>
                 <input type="number" min="0" max="100" className="w-full border-b border-gray-200 py-2 text-sm focus:outline-none focus:border-black bg-transparent font-medium" 
                        value={invoice.taxRate} onChange={e => updateField('taxRate', Number(e.target.value))} />
               </div>
               <div>
                 <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1 tracking-widest">Discount</label>
                 <input type="number" min="0" className="w-full border-b border-gray-200 py-2 text-sm focus:outline-none focus:border-black bg-transparent font-medium" 
                        value={invoice.discount} onChange={e => updateField('discount', Number(e.target.value))} />
               </div>
             </div>
             
             <div className="pt-6 border-t border-gray-100">
               <h3 className="text-[10px] uppercase font-bold text-gray-400 mb-4 tracking-widest">Bank Details</h3>
               <div className="space-y-4">
                 <div>
                   <input className="w-full border-b border-gray-200 py-2 text-sm focus:outline-none focus:border-black bg-transparent" placeholder="Bank Name"
                          value={invoice.bankDetails?.bankName || ''} onChange={e => updateField('bankDetails', { ...invoice.bankDetails, bankName: e.target.value })} />
                 </div>
                 <div>
                   <input className="w-full border-b border-gray-200 py-2 text-sm focus:outline-none focus:border-black bg-transparent" placeholder="Account Name"
                          value={invoice.bankDetails?.accountName || ''} onChange={e => updateField('bankDetails', { ...invoice.bankDetails, accountName: e.target.value })} />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                   <input className="w-full border-b border-gray-200 py-2 text-sm focus:outline-none focus:border-black bg-transparent" placeholder="A/c No."
                          value={invoice.bankDetails?.accountNumber || ''} onChange={e => updateField('bankDetails', { ...invoice.bankDetails, accountNumber: e.target.value })} />
                   <input className="w-full border-b border-gray-200 py-2 text-sm focus:outline-none focus:border-black bg-transparent" placeholder="IFSC Code"
                          value={invoice.bankDetails?.ifscCode || ''} onChange={e => updateField('bankDetails', { ...invoice.bankDetails, ifscCode: e.target.value })} />
                 </div>
                 <div>
                   <input className="w-full border-b border-gray-200 py-2 text-sm focus:outline-none focus:border-black bg-transparent" placeholder="Branch"
                          value={invoice.bankDetails?.branch || ''} onChange={e => updateField('bankDetails', { ...invoice.bankDetails, branch: e.target.value })} />
                 </div>
               </div>
             </div>
         </div>
         <div className="space-y-6">
           <div>
              <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 tracking-widest">Notes</label>
              <textarea className="w-full border border-gray-200 p-4 text-sm focus:outline-none focus:border-black bg-transparent resize-none h-24" 
                        value={invoice.notes} onChange={e => updateField('notes', e.target.value)} />
           </div>
           <div>
              <label className="block text-[10px] uppercase font-bold text-gray-400 mb-2 tracking-widest">Terms & Conditions</label>
              <textarea className="w-full border border-gray-200 p-4 text-sm focus:outline-none focus:border-black bg-transparent resize-none h-24" 
                        value={invoice.terms} onChange={e => updateField('terms', e.target.value)} />
           </div>
         </div>
      </section>

      {/* Signature and QR */}
      <section className="pt-8 border-t border-gray-100 flex justify-end gap-6">
         <div className="w-48 border border-gray-200 p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition relative min-h-[160px]">
           {invoice.qrCodeUrl ? (
             <div className="relative w-full flex justify-center">
               <img src={invoice.qrCodeUrl} alt="QR Code" className="max-h-24 object-contain" />
               <button onClick={removeQrCode} className="absolute -top-4 -right-4 p-2 bg-black text-white hover:bg-gray-800 shadow-md transition">
                 <X size={14} />
               </button>
             </div>
           ) : (
             <>
               <p className="text-[10px] text-gray-400 mb-3 font-bold uppercase tracking-widest leading-relaxed">QR Code</p>
               <button onClick={() => qrCodeInputRef.current?.click()} className="text-[10px] font-bold uppercase border border-gray-200 px-4 py-2 hover:bg-black hover:text-white transition tracking-widest">Upload</button>
               <input type="file" ref={qrCodeInputRef} onChange={handleQrCodeUpload} accept="image/*" className="hidden" />
             </>
           )}
         </div>
         <div className="w-64 border border-gray-200 p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition relative min-h-[160px]">
           {invoice.signatureUrl ? (
             <div className="relative w-full flex justify-center">
               <img src={invoice.signatureUrl} alt="Signature" className="max-h-24 object-contain" />
               <button onClick={removeSignature} className="absolute -top-4 -right-4 p-2 bg-black text-white hover:bg-gray-800 shadow-md transition">
                 <X size={14} />
               </button>
             </div>
           ) : (
             <>
               <p className="text-[10px] text-gray-400 mb-3 font-bold uppercase tracking-widest leading-relaxed">Authorized Signatory / Seal</p>
               <button onClick={() => signatureInputRef.current?.click()} className="text-[10px] font-bold uppercase border border-gray-200 px-4 py-2 hover:bg-black hover:text-white transition tracking-widest">Upload</button>
               <input type="file" ref={signatureInputRef} onChange={handleSignatureUpload} accept="image/*" className="hidden" />
             </>
           )}
         </div>
      </section>
    </div>
  );
};
