type CommonButtonVariant = 'primary' | 'primary-light' | 'secondary' | 'secondary-tonal' | 'text';
interface CommonButtonProps {
  variant: CommonButtonVariant;
  children: React.ReactNode;
  className?: string;
  onClick: () => void;
}

export default function CommonButton({
  variant,
  className = '',
  children,
  onClick,
}: CommonButtonProps) {
  const CommonButtonVariantClass: Record<CommonButtonVariant, string> = {
    primary:
      'bg-gradient-primary-700 hover:bg-gradient-primary-800 text-white text-opacity-80 font-medium',
    'primary-light': 'bg-gradient-primary-800 text-white hover:bg-primary-100',
    secondary:
      'bg-white bg-opacity-5 border border-white border-opacity-80 text-primary-200 hover:border-primary-200',
    'secondary-tonal': 'bg-white bg-opacity-10 text-white text-opacity-80 hover:bg-opacity-20',
    text: 'bg-transparent',
  };

  return (
    <button
      className={`text-xl h-15 rounded ${CommonButtonVariantClass[variant]} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
