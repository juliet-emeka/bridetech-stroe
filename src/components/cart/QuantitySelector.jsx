import { Minus, Plus } from 'lucide-react'

export default function QuantitySelector({ value, max = 99, onChange, label }) {
  return (
    <div className="inline-flex h-9 items-center rounded-full border border-brand-light bg-brand-white">
      <button
        type="button"
        className="grid size-8 place-items-center rounded-full text-brand-primary transition hover:bg-brand-light disabled:opacity-40"
        onClick={() => onChange(value - 1)}
        disabled={value <= 1}
        aria-label={`Decrease quantity of ${label}`}
      >
        <Minus className="size-3.5" aria-hidden="true" />
      </button>
      <input
        type="number"
        min="1"
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        aria-label={`Quantity of ${label}`}
        className="w-9 bg-transparent text-center text-sm font-bold text-brand-navy [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <button
        type="button"
        className="grid size-8 place-items-center rounded-full text-brand-primary transition hover:bg-brand-light disabled:opacity-40"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label={`Increase quantity of ${label}`}
      >
        <Plus className="size-3.5" aria-hidden="true" />
      </button>
    </div>
  )
}
