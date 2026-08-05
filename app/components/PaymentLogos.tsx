type LogoProps = {
  className?: string;
};

export function MpesaLogo({ className }: LogoProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 72 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <text
        x="0"
        y="14"
        fill="#39B54A"
        fontFamily="Arial Black, Arial, sans-serif"
        fontSize="13"
        fontWeight="900"
        letterSpacing="-0.5"
      >
        M-PESA
      </text>
    </svg>
  );
}

export function VisaLogo({ className }: LogoProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M19.5 1.2h-3.5l-2.2 13.6h3.5L19.5 1.2zm10.3 8.8c0-3.4-4.7-3.5-4.7-5 0-.4.4-.9 1.5-1 .4-.1 1.7-.1 3.2.5l.5-2.6c-.8-.3-1.8-.5-3.2-.5-3.4 0-5.8 1.8-5.8 4.4 0 1.9 1.7 3 3 3.7 1.3.6 1.8 1.1 1.8 1.6 0 .9-1.1 1.3-2.1 1.3-1.7 0-2.8-.5-3.5-.9l-.5 2.8c.7.3 2 .6 3.4.6 3.6 0 6-1.7 6-4.5zm8.8 4.8h3l-2.9-13.6h-2.7c-.8 0-1.5.4-1.8 1.1l-5.2 12.5h3.5l.7-2h4.2l.4 2zm-3.7-4.8l1.7-4.7 1 4.7h-2.7zM8.2 1.2H4.8l-.2.9c-.3.1-.5.3-.7.5-.2.2-.3.4-.4.7L.2 14.8h3.7l1.5-3.9h4.5l.8 3.9h3.2L8.2 1.2zm-.5 8.5l1.8-4.7 1 4.7H7.7z"
        fill="#1A1F71"
      />
    </svg>
  );
}

export function MastercardLogo({ className }: LogoProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle cx="11" cy="10" r="8" fill="#EB001B" />
      <circle cx="21" cy="10" r="8" fill="#F79E1B" fillOpacity="0.85" />
    </svg>
  );
}

export function PayPalLogo({ className }: LogoProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 72 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M26.8 2.2h-7.8c-.7 0-1.3.5-1.4 1.2l-3.1 12.4c-.1.5.3.9.8.9h3.7l.9-3.7h2.4c4.7 0 7.4-2.3 8.1-6.8.3-2-.1-3.4-1.2-4.3-1-.8-2.5-1.2-4.6-1.2v-.5zm.5 6.6c-.4 2.4-2.3 2.4-4.1 2.4h-1l.8-3.2c0-.2.2-.4.5-.4h.5c1.2 0 2.4 0 3 .7.4.4.5 1 .3 1.5z"
        fill="#003087"
      />
      <path
        d="M38.2 2.2h-7.8c-.7 0-1.3.5-1.4 1.2l-3.1 12.4c-.1.5.3.9.8.9h4.3c.6 0 1.1-.4 1.2-1l.3-1.5c.1-.6.6-1 1.2-1h2.3c4.7 0 7.4-2.3 8.1-6.8.3-2-.1-3.4-1.2-4.3-1-.8-2.5-1.2-4.6-1.2l-.1-.7zm.5 6.6c-.4 2.4-2.3 2.4-4.1 2.4h-1l.8-3.2c0-.2.2-.4.5-.4h.5c1.2 0 2.4 0 3 .7.4.4.5 1 .3 1.5z"
        fill="#009CDE"
      />
      <path
        d="M12.4 2.2H6.2c-.5 0-.9.4-1 1L2.1 15.6c-.1.4.2.8.6.8h3.5l.9-3.6.1-.5c.1-.6.5-1 1-1h2.1c4.2 0 6.6-2 7.2-6.1.3-1.8-.1-3.1-1.1-3.9-.9-.7-2.2-1.1-4.1-1.1v-.1z"
        fill="#003087"
      />
    </svg>
  );
}

export function CashLogo({ className }: LogoProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect x="2" y="6" width="20" height="12" rx="2" stroke="#404040" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="2.5" stroke="#404040" strokeWidth="1.5" />
      <path d="M6 9.5h.01M18 14.5h.01" stroke="#404040" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
