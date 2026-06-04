export function Indicator({
  status,
}: {
  status: {
    type: "complete" | "streaming" | "loading" | "fetching" | "error";
    fetching?: string;
    error?: string;
  };
}) {
  const statusText =
    status.type === "complete"
      ? "finished!"
      : status.type === "streaming"
        ? "streaming..."
        : status.type === "loading"
          ? "connecting..."
          : status.type === "fetching"
            ? `fetching ${status.fetching} information...`
            : status.type === "error"
              ? `error ${status.error}`
              : "";
  return (
    <>
      <div className="relative ml-1">
        <div className="absolute inset-0 h-2 w-2 rounded-full bg-green-500" />
        <div className="absolute inset-0 h-2 w-2 animate-ping rounded-full bg-green-500" />
      </div>

      <p className="mt-2 ml-4 text-xs text-mist-400">{statusText}</p>
    </>
  );
}
