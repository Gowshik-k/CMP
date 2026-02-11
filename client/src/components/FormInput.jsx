const FormInput = ({ label, type = 'text', value, onChange, required = false, placeholder, minLength, className = '' }) => {
  return (
    <div className="group">
      <label className="block text-sm font-medium text-zinc-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        className={`block w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-zinc-400 ${className}`}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        minLength={minLength}
      />
    </div>
  );
};

export default FormInput;
