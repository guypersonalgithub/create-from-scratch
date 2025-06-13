import { type CSSProperties } from "react";
import { type TimelineEvent } from "./types";
import "./Timeline.css";

type TimelineProps = {
  events: TimelineEvent[];
  style?: CSSProperties;
  className?: string;
};

export const Timeline = ({ events, style, className = "" }: TimelineProps) => {
  return (
    <div style={style} className={`timeline ${className}`}>
      {events.map((event) => (
        <div key={event.id} className="timeline-item">
          <div className={`timeline-marker ${event.type || "default"}`}></div>
          <div className="timeline-content">
            <div className="timeline-date">{event.date}</div>
            <div className="timeline-title">{event.title}</div>
            <div className="timeline-description">{event.description}</div>
          </div>
        </div>
      ))}
    </div>
  );
};
