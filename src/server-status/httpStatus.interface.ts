type Nullable<T> = T | null;
export interface HttpServerStatus {
  response_status: number;
  ip: string;
  port: number;
  player: number;
  max_players: number;
  name: string;
  extra: Nullable<JSON>;
}
