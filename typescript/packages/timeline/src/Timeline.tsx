import { type CSSProperties } from "react";
import { type TimelineEvent } from "./types";
import { combineStringsWithSpaces } from "@packages/string-utils";
import { dynatic } from "@packages/dynatic-css";

type TimelineProps = {
  className?: string;
  style?: CSSProperties;
  events: TimelineEvent[];
};

export const Timeline = ({ className, style, events }: TimelineProps) => {
  return (
    <div
      className={combineStringsWithSpaces(
        dynatic`
          position: relative;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px 0;

          &::before {
            content: "";
            position: absolute;
            left: 50%;
            top: 0;
            bottom: 0;
            width: 2px;
            background: #e2e8f0;
            transform: translateX(-50%);
          }
        `,
        className,
      )}
      style={style}
    >
      {events.map((event, index) => {
        const isEven = index % 2 === 0;

        return (
          <div
            key={event.id}
            className={combineStringsWithSpaces(
              dynatic`
                position: relative;
                margin-bottom: 40px;
              `,
              isEven
                ? dynatic`
                  padding-right: calc(50% + 30px);
                  text-align: right;
                `
                : dynatic`
                  padding-left: calc(50% + 30px);
                  text-align: left;
                `,
            )}
          >
            <div
              className={combineStringsWithSpaces(
                dynatic`
                position: absolute;
                left: 50%;
                top: 20px;
                width: 16px;
                height: 16px;
                border-radius: 50%;
                background: #3b82f6;
                border: 3px solid #ffffff;
                box-shadow: 0 0 0 3px #e2e8f0;
                transform: translateX(-50%);
                z-index: 2;
              `,
                event.type === "success" &&
                  dynatic`
                  background: #10b981;
                `,
                event.type === "warning" &&
                  dynatic`
                  background: #f59e0b;
                `,
                event.type === "error" &&
                  dynatic`
                  background: #ef4444;
                `,
              )}
            />
            <div
              className={combineStringsWithSpaces(
                dynatic`
                background: #ffffff;
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                padding: 20px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                position: relative;
              `,
                isEven
                  ? dynatic`
                      &::before {
                        content: "";
                        position: absolute;
                        right: -8px;
                        top: 20px;
                        width: 0;
                        height: 0;
                        border-top: 8px solid transparent;
                        border-bottom: 8px solid transparent;
                        border-left: 8px solid #e2e8f0;
                      }
  
                      &::after {
                        content: "";
                        position: absolute;
                        right: -7px;
                        top: 20px;
                        width: 0;
                        height: 0;
                        border-top: 8px solid transparent;
                        border-bottom: 8px solid transparent;
                        border-left: 8px solid #ffffff;
                      }
                    `
                  : dynatic`
                      &::before {
                        content: "";
                        position: absolute;
                        left: -8px;
                        top: 20px;
                        width: 0;
                        height: 0;
                        border-top: 8px solid transparent;
                        border-bottom: 8px solid transparent;
                        border-right: 8px solid #e2e8f0;
                      }

                      &::after {
                        content: "";
                        position: absolute;
                        left: -7px;
                        top: 20px;
                        width: 0;
                        height: 0;
                        border-top: 8px solid transparent;
                        border-bottom: 8px solid transparent;
                        border-right: 8px solid #ffffff;
                      }
                    `,
              )}
            >
              <div
                className={dynatic`
                  font-size: 14px;
                  color: #6b7280;
                  font-weight: 500;
                  margin-bottom: 8px;
                `}
              >
                {event.date}
              </div>
              <div
                className={dynatic`
                  font-size: 18px;
                  font-weight: 600;
                  color: #1f2937;
                  margin-bottom: 8px;
                `}
              >
                {event.title}
              </div>
              <div
                className={dynatic`
                  font-size: 14px;
                  color: #4b5563;
                  line-height: 1.5;
                `}
              >
                {event.description}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
