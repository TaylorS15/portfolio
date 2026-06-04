export type IndicatorStatus = {
  type:
    | "complete"
    | "streaming"
    | "loading"
    | "fetching"
    | "error"
    | "waiting";
  fetching?: string;
  error?: string;
};
