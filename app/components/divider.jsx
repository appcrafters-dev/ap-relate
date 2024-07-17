export default function OrDivider({ text = "or" }) {
  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-200" />
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="bg-tfm-bg px-2 text-gray-500">{text}</span>
      </div>
    </div>
  );
}
