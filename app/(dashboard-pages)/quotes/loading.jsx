import Spinner from "@/components/ui/spinner";

export default function LoadingQuotes() {
  return (
    <div className="mx-auto flex min-h-96 max-w-sm animate-pulse flex-col items-center justify-center space-y-4 py-2">
      <div className="space-y-2 text-center text-gray-400">
        <Spinner />
        <h3 className="animate-pulse text-sm font-bold text-gray-900">
          Fetching your quotes...
        </h3>
        <p className="text-sm italic text-gray-500">
          &quot;Even if you are on the right track, you will get run over if you
          just sit there.&quot; - Will Rogers
        </p>
      </div>
    </div>
  );
}
