import { useFormik } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  position: Yup.string().required("Position is required"),
  team: Yup.array().of(Yup.string()),
});

export default function PlayerForm({
  teams,
  onSubmit,
  initialValues = { name: "", position: "", team: [] },
  isEditing = false,
}) {
  const formik = useFormik({
    initialValues,
    enableReinitialize: true, // important so it updates when editing
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await onSubmit(values);
        if (!isEditing) resetForm(); // only reset if adding
      } catch (err) {
        console.error(err);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block font-medium mb-1">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          className={`input input-bordered w-full ${
            formik.touched.name && formik.errors.name ? "input-error" : ""
          }`}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.name}
        />
        {formik.touched.name && formik.errors.name && (
          <div className="text-error text-sm mt-1">{formik.errors.name}</div>
        )}
      </div>

      <div>
        <label htmlFor="position" className="block font-medium mb-1">
          Position
        </label>
        <select
          id="position"
          name="position"
          className={`select select-bordered w-full ${
            formik.touched.position && formik.errors.position
              ? "select-error"
              : ""
          }`}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.position}
        >
          <option value="">Select position</option>
          <option value="setter">Setter</option>
          <option value="libero">Libero</option>
          <option value="outside">Outside</option>
          <option value="middle">Middle</option>
          <option value="opposite">Opposite</option>
        </select>
        {formik.touched.position && formik.errors.position && (
          <div className="text-error text-sm mt-1">
            {formik.errors.position}
          </div>
        )}
      </div>

      <div>
        <label className="block font-medium mb-1">Team(s)</label>
        <div className="space-y-2">
          {teams.map((t) => (
            <label key={t._id} className="flex items-center gap-2">
              <input
                type="checkbox"
                name="team"
                value={t._id}
                checked={formik.values.team.includes(t._id)}
                onChange={(e) => {
                  const value = e.target.value;
                  const selectedTeams = formik.values.team.includes(value)
                    ? formik.values.team.filter((id) => id !== value)
                    : [...formik.values.team, value];
                  formik.setFieldValue("team", selectedTeams);
                }}
                className="checkbox checkbox-primary"
              />
              <span>{t.name}</span>
            </label>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="btn btn-primary w-full mt-2"
        disabled={formik.isSubmitting}
      >
        {formik.isSubmitting
          ? isEditing
            ? "Updating..."
            : "Creating..."
          : isEditing
          ? "Update Player"
          : "Create Player"}
      </button>
    </form>
  );
}
