import React, { useRef } from 'react';
import { InvoiceDetails } from '../types';
import * as htmlToImage from 'html-to-image';
import jsPDF from 'jspdf';
import { Download } from 'lucide-react';

interface InvoicePreviewProps {
  invoice: InvoiceDetails;
}

export const InvoicePreview: React.FC<InvoicePreviewProps> = ({ invoice }) => {
  const printRef = useRef<HTMLDivElement>(null);

  const calculateSubtotal = () => invoice.items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  const calculateTotal = () => {
    const sub = calculateSubtotal();
    return sub * (1 + invoice.taxRate / 100) - invoice.discount;
  };

  const handleDownloadPdf = async () => {
    const element = printRef.current;
    if (!element) return;

    try {
      const data = await htmlToImage.toPng(element, { 
        pixelRatio: 2, 
        cacheBust: true,
      });

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgProperties = pdf.getImageProperties(data);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

      pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${invoice.invoiceNumber}.pdf`);
    } catch (error) {
      console.error('Failed to generate PDF', error);
      alert('Failed to generate PDF');
    }
  };

  return (
    <div className="flex flex-col gap-6 items-center w-full max-w-full">
      <div className="w-full flex justify-end max-w-[794px] px-4">
        <button 
          onClick={handleDownloadPdf}
          className="text-xs font-bold uppercase bg-black text-white px-6 py-3 tracking-widest hover:bg-gray-800 transition shadow-lg shrink-0"
        >
          Export PDF
        </button>
      </div>
      
      <div className="w-full overflow-x-auto pb-8 flex justify-center px-4">
        {/* The Letterhead Preview Surface */}
        <div className="bg-white shadow-2xl relative overflow-hidden shrink-0" ref={printRef} style={{ width: '794px', minHeight: '1123px', boxSizing: 'border-box' }}>
        
        {/* Letterhead Background */}
        {invoice.letterheadUrl && (
          <div className="absolute inset-0 z-0 select-none pointer-events-none">
            <img src={invoice.letterheadUrl} alt="Letterhead" className="w-full h-full object-[100%_100%]" />
          </div>
        )}

        {/* Content Overlay */}
        <div 
          className="relative z-10 flex flex-col h-full min-h-[1123px]" 
          style={{ 
             paddingTop: invoice.contentPadding?.top ?? 64,
             paddingRight: invoice.contentPadding?.right ?? 64,
             paddingBottom: invoice.contentPadding?.bottom ?? 64,
             paddingLeft: invoice.contentPadding?.left ?? 64,
          }}
        >
          
          {/* Bill To Section */}
          <div className="flex justify-between mb-12">
            <div className="w-1/2">
              <div className="text-xl font-bold text-black mb-2 whitespace-pre-line leading-snug">
                <span className="text-sm font-bold text-[#0033cc] block mb-2">Bill To :</span>
                {invoice.clientName}
                {invoice.clientAddress && <><br /><span className="text-sm font-normal">{invoice.clientAddress}</span></>}
                {invoice.clientEmail && <><br /><span className="text-sm font-normal">{invoice.clientEmail}</span></>}
                {invoice.clientPhone && <><br /><span className="text-sm font-normal">{invoice.clientPhone}</span></>}
              </div>
            </div>
            <div className="text-right w-1/2 flex flex-col items-end">
              <table className="text-sm font-bold text-black">
                <tbody>
                  <tr><td className="pr-4 py-1">Invoice No. :</td><td className="text-[#0033cc]">{invoice.invoiceNumber}</td></tr>
                  <tr><td className="pr-4 py-1">Invoice Date :</td><td className="border-b border-black">{invoice.date}</td></tr>
                  {invoice.dueDate && <tr><td className="pr-4 py-1">Due Date :</td><td className="border-b border-black">{invoice.dueDate}</td></tr>}
                </tbody>
              </table>
            </div>
          </div>

          {/* Item Table */}
          <div className="flex-1">
            <table className="w-full border-collapse border border-black">
              <thead>
                <tr className="bg-[#0033cc] text-white">
                  <th className="border border-black py-2 px-2 text-xs font-semibold w-12 text-center">S. No.</th>
                  <th className="border border-black py-2 px-4 text-xs font-semibold text-left">Description of Goods / Services</th>
                  <th className="border border-black py-2 px-2 text-xs font-semibold w-24 text-center">HSN / SAC</th>
                  <th className="border border-black py-2 px-2 text-xs font-semibold w-16 text-center">Qty</th>
                  <th className="border border-black py-2 px-2 text-xs font-semibold w-20 text-center">Unit</th>
                  <th className="border border-black py-2 px-2 text-xs font-semibold w-24 text-center">Rate ({invoice.currency})</th>
                  <th className="border border-black py-2 px-2 text-xs font-semibold w-28 text-center">Amount ({invoice.currency})</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {invoice.items.map((item, index) => (
                  <tr key={item.id}>
                    <td className="border border-black py-3 px-2 text-center text-sm font-semibold">{index + 1}</td>
                    <td className="border border-black py-3 px-4 text-sm text-black">{item.description}</td>
                    <td className="border border-black py-3 px-2 text-center text-sm text-black">{item.hsn || ''}</td>
                    <td className="border border-black py-3 px-2 text-center text-sm text-black">{item.quantity}</td>
                    <td className="border border-black py-3 px-2 text-center text-sm text-black">{item.unit || ''}</td>
                    <td className="border border-black py-3 px-2 text-center text-sm text-black">{item.rate.toFixed(2)}</td>
                    <td className="border border-black py-3 px-2 text-center text-sm text-black">{(item.quantity * item.rate).toFixed(2)}</td>
                  </tr>
                ))}
                <tr>
                   <td colSpan={6} className="border border-black py-2 px-4 text-right font-bold text-white bg-[#0033cc] text-sm tracking-wider uppercase">
                     TOTAL ({invoice.currency})
                   </td>
                   <td className="border border-black py-2 px-2 text-center font-bold text-sm bg-gray-50">
                     {calculateSubtotal().toFixed(2)}
                   </td>
                </tr>
                {invoice.taxRate > 0 && (
                  <tr>
                     <td colSpan={6} className="border border-black py-2 px-4 text-right font-bold text-black text-sm">
                       Tax ({invoice.taxRate}%)
                     </td>
                     <td className="border border-black py-2 px-2 text-center font-bold text-sm">
                       {(calculateSubtotal() * (invoice.taxRate / 100)).toFixed(2)}
                     </td>
                  </tr>
                )}
                {invoice.discount > 0 && (
                  <tr>
                     <td colSpan={6} className="border border-black py-2 px-4 text-right font-bold text-red-600 text-sm">
                       Discount
                     </td>
                     <td className="border border-black py-2 px-2 text-center font-bold text-red-600 text-sm">
                       -{invoice.discount.toFixed(2)}
                     </td>
                  </tr>
                )}
                {(invoice.taxRate > 0 || invoice.discount > 0) && (
                  <tr>
                     <td colSpan={6} className="border border-black py-2 px-4 text-right font-bold text-white bg-[#0033cc] text-sm tracking-wider uppercase">
                       GRAND TOTAL ({invoice.currency})
                     </td>
                     <td className="border border-black py-2 px-2 text-center font-bold text-sm bg-gray-50">
                       {calculateTotal().toFixed(2)}
                     </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer Notes & Signature */}
          <footer className="mt-8 flex flex-col pt-4">
            <div className="mt-auto flex justify-between items-end border-t border-black pt-4">
               <div className="w-2/3 pr-8 space-y-6">
                 {invoice.notes && (
                   <div className="text-[9px] uppercase tracking-widest text-gray-500 font-bold whitespace-pre-line leading-relaxed">
                     <span className="text-black mb-1 block">Notes:</span>
                     {invoice.notes}
                   </div>
                 )}
                 {invoice.terms && (
                   <div className="text-[9px] uppercase tracking-widest text-gray-400 font-bold whitespace-pre-line leading-relaxed">
                     <span className="text-black mb-1 block">Terms:</span>
                     {invoice.terms}
                   </div>
                 )}
               </div>
               
               <div className="w-1/3 flex flex-col items-center">
                 {invoice.signatureUrl && (
                   <img src={invoice.signatureUrl} alt="Authorized Signatory" className="max-h-24 object-contain mb-2" />
                 )}
                 <div className="w-full border-t border-gray-300 pt-2 text-center text-[9px] uppercase font-bold text-gray-500 tracking-widest">
                   Authorized Signatory
                 </div>
               </div>
            </div>
          </footer>
        </div>
      </div>
      </div>
    </div>
  );
};
