export default function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="toggle-row">
      <span>{label}</span>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        className={`toggle ${checked ? 'on' : ''}`}
        onClick={() => onChange(!checked)}
      >
        <span className="thumb" />
      </button>
    </label>
  );
}
