import EventHistory from "./EventHistory";

export default interface ApiHistoryType {
  events: Array<EventHistory>,
  pages: number,
  total: number,
  pageSize: number
}
