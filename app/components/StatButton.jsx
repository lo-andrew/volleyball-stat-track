export default function StatButton({ category, field, value, setFieldValue }) {
  const handleIncrement = () => {
    setFieldValue(`${category}.${field}`, value + 1);
  };

  const handleDecrement = () => {
    setFieldValue(`${category}.${field}`, Math.max(0, value - 1));
  };

  return (
    <div className="flex flex-col items-center gap-2 p-3 border rounded-lg shadow-md">
      <span className="text-lg font-semibold capitalize">{field}</span>
      <span className="text-4xl font-extrabold">{value}</span>
      <div className="flex gap-3">
        <button
          type="button"
          className="btn btn-secondary text-2xl px-4"
          onClick={handleDecrement}
        >
          -
        </button>
        <button
          type="button"
          className="btn btn-primary text-2xl px-4"
          onClick={handleIncrement}
        >
          +
        </button>
      </div>
    </div>
  );
}
