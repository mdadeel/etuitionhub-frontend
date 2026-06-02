const Highlight = ({ text = "", query = "" }) => {
  if (!query || !text) return <>{text}</>;

  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark
            key={`${i}-${part}`}
            className="bg-[#2563EB]/20 text-[#2563EB] rounded px-0.5"
          >
            {part}
          </mark>
        ) : (
          <span key={`${i}-${part}`}>{part}</span>
        ),
      )}
    </>
  );
};

export default Highlight;
