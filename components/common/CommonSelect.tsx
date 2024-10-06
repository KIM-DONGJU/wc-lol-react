interface CommonSelectProps {
  placeholder: string;
  options: {
    label: string;
    value: string | number;
  }[];
  value: string | number;
  onChange: (value: string) => void;
  className?: string;
}

export default function CommonSelect({
  placeholder,
  options,
  value,
  onChange,
  className,
}: CommonSelectProps) {
  const handleOnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <label
      className={`flex items-center rounded outline outline-1 outline-opacity-white-50 focus-within:outline-primary-100 max-w-[90%] h-15 pr-5 ${className}`}
    >
      <select
        className="px-5 block w-full h-full bg-transparent text-white text-opacity-80 rounded-md shadow-lg outline-none text-xl"
        value={value}
        onChange={handleOnChange}
      >
        <option disabled hidden className="text-black" value="">
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} className="text-black" value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
