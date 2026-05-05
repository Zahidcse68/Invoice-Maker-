import { InvoiceDetails, Client } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const generateInvoiceNumber = () => {
  return `INV-${new Date().getTime().toString().slice(-6)}`;
};

export const defaultInvoice: InvoiceDetails = {
  invoiceNumber: generateInvoiceNumber(),
  date: new Date().toISOString().split('T')[0],
  dueDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0],
  fromName: 'My Company',
  fromEmail: 'contact@mycompany.com',
  fromAddress: '123 Business Rd, City, Country',
  fromPhone: '+1 234 567 890',
  clientId: null,
  clientName: '',
  clientEmail: '',
  clientAddress: '',
  clientPhone: '',
  items: [
    { id: uuidv4(), description: 'Consulting Services', hsn: '', quantity: 1, unit: 'Nos', rate: 1000.00 }
  ],
  currency: '₹',
  taxRate: 0,
  discount: 0,
  notes: 'Thank you for your business.',
  terms: 'Please pay within 7 days. Late payments may be subject to a fee.',
  letterheadUrl: null,
  signatureUrl: null,
  contentPadding: { top: 64, right: 64, bottom: 64, left: 64 },
};
