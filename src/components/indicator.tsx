import type { IndicatorStatus } from "#/lib/types";

export function Indicator({ status }: { status: IndicatorStatus }) {
  const indicatorColor = {
    complete: "bg-green-500",
    streaming: "bg-blue-500",
    loading: "bg-yellow-500",
    fetching: "bg-purple-500",
    error: "bg-red-500",
    waiting: "bg-mist-400",
  }[status.type];

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
              ? `${status.error}`
              : status.type === "waiting"
                ? "waiting..."
                : "";
  return (
    <>
      <div className="relative ml-1">
        <div
          className={`absolute inset-0 h-2 w-2 rounded-full ${indicatorColor}`}
        />
        <div
          className={`absolute inset-0 h-2 w-2 animate-ping rounded-full ${indicatorColor}`}
        />
      </div>

      <p className="mt-2 ml-4 text-xs text-mist-400">{statusText}</p>
    </>
  );
}
