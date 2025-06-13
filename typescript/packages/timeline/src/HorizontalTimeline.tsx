import { type CSSProperties } from "react";
import { type TimelineEvent } from "./types";
import "./Timeline.css";

type HorizontalTimelineProps = {
  events: TimelineEvent[];
  style?: CSSProperties;
  className?: string;
};

export const HorizontalTimeline = ({ events, style, className = "" }: HorizontalTimelineProps) => {
  return (
    <div style={{ ...style, paddingLeft: "150px" }} className={`horizontal-timeline ${className}`}>
      <div className="horizontal-timeline-container">
        {events.map((event, index) => (
          <div key={event.id} className="horizontal-timeline-item">
            <div className="horizontal-timeline-content">
              <div className="horizontal-timeline-date">{event.date}</div>
              <div className="horizontal-timeline-title">{event.title}</div>
              <div className="horizontal-timeline-description">{event.description}</div>
            </div>
            <div className={`horizontal-timeline-marker ${event.type || "default"}`}></div>
          </div>
        ))}
      </div>
    </div>
  );
};
