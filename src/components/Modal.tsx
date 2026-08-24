import type { ReactNode } from 'react';
import { X } from 'lucide-react';

export default function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}) {
  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(event) => event.stopPropagation()}>
        <button
          className="icon-btn modal-close"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="modal-body">
          {title ? <h3 className="modal-title">{title}</h3> : null}
          {children}
        </div>
      </div>
    </div>
  );
}
