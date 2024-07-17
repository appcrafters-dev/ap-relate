export default function Copyright() {
  const year = new Date().getFullYear();
  return (
    <p className="py-6 text-center font-subheading text-xs text-gray-500">
      &copy; {year} Total Family Management, LLC. All rights reserved.
    </p>
  );
}
