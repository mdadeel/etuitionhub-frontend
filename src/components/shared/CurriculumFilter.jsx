const OPTIONS = [
  { id: 'nctb', label: 'NCTB (Class 1–10)' },
  { id: 'nctb_2024', label: 'NCTB 2024 New' },
  { id: 'ssc', label: 'SSC Prep' },
  { id: 'hsc', label: 'HSC Prep' },
  { id: 'o_level', label: 'O-Level' },
  { id: 'a_level', label: 'A-Level' },
  { id: 'ielts_toefl', label: 'IELTS / TOEFL' },
  { id: 'admission', label: 'Admission (DU/BUET/Medical)' },
];

const CurriculumFilter = ({ value, onChange }) => (
  <div>
    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1 mb-2 block">Curriculum</label>
    <div className="flex flex-wrap gap-1.5">
      <button
        type="button"
        onClick={() => onChange(null)}
        className={`px-2.5 py-1 text-xs rounded-full border ${!value ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-primary/50'}`}
      >All</button>
      {OPTIONS.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          className={`px-2.5 py-1 text-xs rounded-full border ${value === o.id ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-primary/50'}`}
        >{o.label}</button>
      ))}
    </div>
  </div>
);

export default CurriculumFilter;
