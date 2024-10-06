import Image from 'next/image';

interface CommonInputProps {
  type?: string;
  placeholder?: string;
  value: string;
  clearIcon?: boolean;
  fontColor?: 'white' | 'black';
  className?: string;
  onChange: (value: string) => void;
}

export default function CommonInput({
  type = 'text',
  placeholder,
  value,
  clearIcon = false,
  fontColor = 'white',
  className = '',
  onChange,
}: CommonInputProps) {
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const fontColorClass = {
    white: 'text-white',
    black: 'text-light-black',
  };

  return (
    <label
      className={`flex items-center rounded-3xl max-sm:rounded-full px-4 py-3 outline outline-1 focus-within:outline-2 outline-opacity-white-50 focus-within:outline-primary-100 w-[494px] max-w-[90%] h-14 ${className}`}
    >
      {!clearIcon && (
        <Image
          alt="search-icon"
          className="w-7 h-7 stroke-white"
          color="white"
          height="28"
          src="icons/magnifying-glass.svg"
          width="28"
        />
      )}
      <input
        className={`w-full h-14 ml-3 bg-none bg-transparent outline-none text-lg ${fontColorClass[fontColor]}`}
        placeholder={placeholder}
        type={type}
        value={value}
        onChange={handleOnChange}
      />
    </label>
  );
}
