export default function StatButton({
  category,
  field,
  value,
  setFieldValue,
  isNested = true,
}) {
  const fieldPath = isNested ? `${category}.${field}` : category;

  return (
    <div className="flex flex-col items-center gap-2 p-3 border rounded-lg shadow-md">
      <span className="text-lg font-semibold capitalize">{field}</span>
      <span className="text-4xl font-extrabold">{value}</span>
      <div className="flex gap-3">
        <button
          type="button"
          className="btn btn-secondary text-2xl px-4"
          onClick={() => setFieldValue(fieldPath, Math.max(0, value - 1))}
        >
          -
        </button>
        <button
          type="button"
          className="btn btn-primary text-2xl px-4"
          onClick={() => setFieldValue(fieldPath, value + 1)}
        >
          +
        </button>
      </div>
    </div>
  );
}
