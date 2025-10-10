export default function StatButton({ category, field, value, setFieldValue }) {
  return (
    <div className="flex flex-col items-center gap-2 p-2 border rounded">
      <span className="text-lg font-bold">{field}</span>
      <span className="text-4xl font-extrabold">{value}</span>
      <div className="flex gap-2">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setFieldValue(category, value + 1)}
        >
          +
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => setFieldValue(category, Math.max(0, value - 1))}
        >
          -
        </button>
      </div>
    </div>
  );
}
