export type TimelineEvent = {
  id: string
  date: string
  title: string
  description: string
  type?: "default" | "success" | "warning" | "error"
}

export type TimelineProps = {
  events: TimelineEvent[]
  className?: string
}
