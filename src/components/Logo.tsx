import { useState } from 'react';
import { Dice5 } from 'lucide-react';

export default function Logo({
  size = 96,
  className = '',
}: {
  size?: number;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`logo-fallback ${className}`}
        style={{
          width: size,
          height: size,
        }}
        aria-label="Logo fallback"
      >
        <Dice5 size={Math.round(size * 0.52)} strokeWidth={2.2} />
      </div>
    );
  }

  return (
    <img
      src="/assets/logo/logo.png"
      alt="Logo"
      width={size}
      height={size}
      className={`logo ${className}`}
      onError={() => setFailed(true)}
      draggable={false}
    />
  );
}
