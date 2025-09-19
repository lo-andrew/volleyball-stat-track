import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold text-blue-500">Tailwind is working!</h1>
      <button className="btn btn-primary">DaisyUI Button</button>
      <div className="p-10 space-y-4">
        <h1 className="text-3xl font-bold">DaisyUI Test</h1>
        <button className="btn btn-primary">Primary</button>
        <button className="btn btn-secondary">Secondary</button>
        <input
          type="text"
          placeholder="Type here"
          className="input input-bordered w-full max-w-xs"
        />
      </div>
    </div>
  );
}
