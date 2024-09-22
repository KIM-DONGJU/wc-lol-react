type CommonButtonVariant = 'primary' | 'primary-light' | 'secondary';
type CommonButtonRadius = 'rounded' | 'rounded-full';
type CommonButtonWidth = 'md' | 'full';

interface CommonButtonProps {
  variant: CommonButtonVariant;
  radius?: CommonButtonRadius;
  width?: CommonButtonWidth;
  children: React.ReactNode;
  onClick: () => void;
}

export default function CommonButton({
  variant,
  radius = 'rounded',
  width = 'md',
  children,
  onClick,
}: CommonButtonProps) {
  const CommonButtonVariantClass: Record<CommonButtonVariant, string> = {
    primary: 'bg-primary-100 text-white font-bold',
    'primary-light': 'bg-primary-200 text-white font-bold',
    secondary: 'bg-opacity-white-5 border text-primary-200 hover:border-primary-200',
  };

  const CommonButtonWidthClass = {
    md: 'w-[200px]',
    full: 'w-full',
  };

  return (
    <button
      className={`${CommonButtonVariantClass[variant]} ${radius} ${CommonButtonWidthClass[width]} h-15 text-xl`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
