import SearchIcon from '@/public/icons/magnifying-glass.svg';

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
  height = '54px',
  placeholder,
  type = 'text',
  width = '494px',
  onChange,
  value,
}: CommonInputProps) {
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <label
      className="flex items-center rounded-3xl px-4 py-3 outline outline-1 focus-within:outline-2 outline-white focus-within:outline-primary"
      style={{ width, height }}
    >
      <SearchIcon width="28px" />
      <input
        className="ml-3 text-white bg-none bg-transparent outline-none"
        placeholder={placeholder}
        type={type}
        value={value}
        onChange={handleOnChange}
      />
    </label>
  );
}
