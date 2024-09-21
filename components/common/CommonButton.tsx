type CommonButtonVariant = 'primary' | 'primary-light' | 'secondary';
type CommonButtonRadius = 'rounded' | 'rounded-full';

interface CommonButtonProps {
  variant: CommonButtonVariant;
  radius?: CommonButtonRadius;
  width?: string;
  height?: string;
  children: React.ReactNode;
  onClick: () => void;
}

export default function CommonButton({
  variant,
  radius = 'rounded',
  width = '200px',
  height = '60px',
  children,
  onClick,
}: CommonButtonProps) {
  const CommonButtonVariantClass: Record<CommonButtonVariant, string> = {
    primary: 'bg-primary-100 text-white font-bold',
    'primary-light': 'bg-primary-200 text-white font-bold',
    secondary: 'bg-opacity-white-5 border text-primary-200 font-medium',
  };

  return (
    <button
      className={`${CommonButtonVariantClass[variant]} ${radius} text-xl`}
      style={{ width, height }}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
