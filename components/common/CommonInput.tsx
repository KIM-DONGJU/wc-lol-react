import Image from 'next/image';

interface CommonInputProps {
  type?: string;
  placeholder?: string;
  backgroundColor?: string;
  width?: string;
  height?: string;
  value: string;
  onChange: (value: string) => void;
}

export default function CommonInput({
  placeholder,
  type = 'text',
  width = 'w-[494px]',
  onChange,
  value,
}: CommonInputProps) {
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <label
      className={`flex items-center rounded-3xl max-sm:rounded-full px-4 py-3 outline outline-1 focus-within:outline-2 outline-opacity-white-50 focus-within:outline-primary-100 ${width} max-w-[90%] h-14`}
    >
      <Image
        alt="search-icon"
        className="w-7 h-7 stroke-white"
        color="white"
        height="28"
        src="icons/magnifying-glass.svg"
        width="28"
      />
      <input
        className="w-full h-14 ml-3 text-white bg-none bg-transparent outline-none"
        placeholder={placeholder}
        type={type}
        value={value}
        onChange={handleOnChange}
      />
    </label>
  );
}
