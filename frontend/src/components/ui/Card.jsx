export function Card({ children, className = '' }) {
  return (
    <div className={`glass-panel rounded-xl overflow-hidden transition-colors ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return <div className={`px-6 py-4 border-b border-gray-200 dark:border-slate-800 transition-colors ${className}`}>{children}</div>;
}

export function CardBody({ children, className = '' }) {
  return <div className={`px-6 py-4 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = '' }) {
  return <div className={`px-6 py-4 border-t border-gray-200 dark:border-slate-800 transition-colors ${className}`}>{children}</div>;
}
