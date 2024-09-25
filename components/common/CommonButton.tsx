type CommonButtonVariant = 'primary' | 'primary-light' | 'secondary' | 'secondary-tonal';
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
  width = 'w-[200px]',
  height = 'h-15',
  children,
  onClick,
}: CommonButtonProps) {
  const CommonButtonVariantClass: Record<CommonButtonVariant, string> = {
    primary: 'bg-primary-100 text-white font-bold',
    'primary-light': 'bg-primary-200 text-white font-bold',
    secondary: 'bg-opacity-white-5 border text-primary-200 hover:border-primary-200',
    'secondary-tonal': 'bg-opacity-white-10 text-opacity-white-80',
  };

  return (
    <button
      className={`text-lg ${CommonButtonVariantClass[variant]} ${radius} ${width} ${height} text-xl`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
