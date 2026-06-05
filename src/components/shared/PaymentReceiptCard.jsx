import { CheckCircle2, Copy } from 'lucide-react';
import { useState } from 'react';

const CopyableId = ({ value }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button onClick={copy} className="inline-flex items-center gap-1 font-mono text-xs hover:text-primary">
      {value} <Copy size={10} /> {copied && <span className="text-emerald-600">copied</span>}
    </button>
  );
};

const PaymentReceiptCard = ({ receipt }) => (
  <div className="border border-emerald-200 bg-emerald-50/30 rounded-lg p-6">
    <div className="flex items-center gap-2 mb-4">
      <CheckCircle2 className="text-emerald-600" size={20} />
      <h3 className="text-base font-semibold text-emerald-900">Payment submitted</h3>
    </div>
    <dl className="space-y-2 text-sm">
      <div className="flex justify-between"><dt className="text-muted-foreground">Transaction ID</dt><dd><CopyableId value={receipt.transactionId} /></dd></div>
      <div className="flex justify-between"><dt className="text-muted-foreground">Amount</dt><dd className="font-semibold">৳{Number(receipt.amount).toLocaleString('en-IN')}</dd></div>
      <div className="flex justify-between"><dt className="text-muted-foreground">Method</dt><dd className="uppercase">{receipt.method}</dd></div>
      <div className="flex justify-between"><dt className="text-muted-foreground">Tutor</dt><dd>{receipt.tutorName}</dd></div>
      <div className="flex justify-between"><dt className="text-muted-foreground">Status</dt><dd className="text-amber-700 font-medium">Pending verification</dd></div>
    </dl>
    <p className="mt-4 text-xs text-muted-foreground">Screenshot this page as proof. Admin will verify within 24 hours and notify you.</p>
  </div>
);

export default PaymentReceiptCard;
