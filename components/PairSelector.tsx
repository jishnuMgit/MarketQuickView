"use client";

import Select from "react-select";
import type { SingleValue } from "react-select";
import type { Pair } from "@/types/market";

export default function PairSelector({ pairs, value, onChange }: {
  pairs: Pair[]; value: Pair; onChange: (pair: Pair) => void;
}) {
  return <div className="min-w-[220px]">
    <label className="mb-2 block text-[10px] font-semibold tracking-[.16em] text-slate-500">CURRENCY PAIR</label>
    <Select<Pair, false>
      classNamePrefix="select"
      options={pairs}
      value={value}
      onChange={(option: SingleValue<Pair>) => option && onChange(option)}
      isSearchable
      formatOptionLabel={(option, meta) => meta.context === "menu"
        ? <div className="flex items-center justify-between gap-5"><span className="font-semibold">{option.label}</span><span className="text-xs text-slate-500">{option.volatility}</span></div>
        : <span className="font-semibold">{option.label}</span>}
      getOptionLabel={option => option.label}
      getOptionValue={option => option.value}
      placeholder="Search pair..."
      menuPortalTarget={typeof document !== "undefined" ? document.body : undefined}
      styles={{ menuPortal: base => ({ ...base, zIndex: 100 }) }}
    />
  </div>;
}
