interface CommonSelectProps {
  placeholder: string;
  width?: string;
  options: {
    label: string;
    value: string | number;
  }[];
  value: string | number;
  onChange: (value: string) => void;
}

export default function CommonSelect({
  placeholder,
  options,
  value,
  onChange,
  width = '356px',
}: CommonSelectProps) {
  const handleOnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <label
      className="flex items-center rounded outline outline-1 focus-within:outline-2 outline-opacity-white-50 focus-within:outline-primary max-w-[90%] h-15 pr-5"
      style={{ width }}
    >
      <select
        className="p-5 block w-full h-full bg-transparent text-opacity-white-80 pr-8 rounded-md shadow-lg outline-none"
        value={value}
        onChange={handleOnChange}
      >
        <option disabled hidden className="text-opacity-white-80" value="">
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} className="text-opacity-white-80" value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}