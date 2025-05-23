interface InputProps {
    label?: string;
    placeholder: string;
    value?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
  }
  
  export default function InputBox({ label, placeholder, onChange, value, className }: InputProps) {
    return (
      <div>
        {label && (
          <div className="text-sm text-black font-medium text-left py-2">
            {label}
          </div>
        )}
        <input
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full text-black px-2 py-1 border rounded border-slate-200 ${className ?? ''}`}
        />
      </div>
    );
  }
  