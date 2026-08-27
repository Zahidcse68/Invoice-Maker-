export interface Client {
  id: string;
  name: string;
  email: string;
  address: string;
  phone: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  hsn?: string;
  quantity: number;
  unit?: string;
  rate: number;
}

export interface InvoiceDetails {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  fromName: string;
  fromEmail: string;
  fromAddress: string;
  fromPhone: string;
  clientId: string | null;
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  clientPhone: string;
  items: InvoiceItem[];
  currency: string;
  taxRate: number; // percentage
  discount: number; // fixed amount or could be percentage
  notes: string;
  terms: string;
  themeColor: string;
  letterheadUrl: string | null;
  signatureUrl: string | null;
  qrCodeUrl: string | null;
  bankDetails: {
    bankName: string;
    accountName: string;
    accountNumber: string;
    ifscCode: string;
    branch: string;
  };
  contentPadding: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}
