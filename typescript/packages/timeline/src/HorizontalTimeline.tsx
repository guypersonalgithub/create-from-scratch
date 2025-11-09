import { type CSSProperties } from "react";
import { type TimelineEvent } from "./types";
import { combineStringsWithSpaces } from "@packages/string-utils";
import { dynatic } from "@packages/dynatic-css";

type HorizontalTimelineProps = {
  className?: string;
  style?: CSSProperties;
  events: TimelineEvent[];
};

export const HorizontalTimeline = ({ events, style, className }: HorizontalTimelineProps) => {
  return (
    <div
      className={combineStringsWithSpaces(
        dynatic`
          position: relative;
          padding: 80px 40px;
          overflow-x: auto;
          background: transparent;
          padding-left: 150px;

          &::before {
            content: "";
            position: absolute;
            top: 50%;
            left: 60px;
            right: 60px;
            height: 2px;
            background: #e2e8f0;
            transform: translateY(-50%);
            z-index: 1;
          }
        `,
        className,
      )}
      style={style}
    >
      <div
        className={dynatic`
          position: relative;
          display: flex;
          align-items: center;
          min-width: max-content;
          height: 200px;
        `}
      >
        {events.map((event, index) => {
          const isEven = index % 2 === 0;

          return (
            <div
              key={event.id}
              className={combineStringsWithSpaces(
                dynatic`
                  position: relative;
                  margin-right: 120px;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  height: 100%;
                `,
                index === events.length - 1 &&
                  dynatic`
                    margin-right: 0;
                  `,
              )}
            >
              <div
                className={combineStringsWithSpaces(
                  dynatic`
                    background: #ffffff;
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                    padding: 16px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    position: absolute;
                    width: 180px;
                    text-align: center;
                  `,
                  isEven
                    ? dynatic`
                        top: calc(50% + 30px);

                        &::before {
                          content: "";
                          position: absolute;
                          top: -8px;
                          left: 50%;
                          transform: translateX(-50%);
                          width: 0;
                          height: 0;
                          border-left: 8px solid transparent;
                          border-right: 8px solid transparent;
                          border-bottom: 8px solid #e2e8f0;
                        }

                        &::after {
                          content: "";
                          position: absolute;
                          top: -7px;
                          left: 50%;
                          transform: translateX(-50%);
                          width: 0;
                          height: 0;
                          border-left: 8px solid transparent;
                          border-right: 8px solid transparent;
                          border-bottom: 8px solid #ffffff;
                        }
              `
                    : dynatic`
                        bottom: calc(50% + 30px);

                        &::before {
                          content: "";
                          position: absolute;
                          bottom: -8px;
                          left: 50%;
                          transform: translateX(-50%);
                          width: 0;
                          height: 0;
                          border-left: 8px solid transparent;
                          border-right: 8px solid transparent;
                          border-top: 8px solid #e2e8f0;
                        }

                        &::after {
                          content: "";
                          position: absolute;
                          bottom: -7px;
                          left: 50%;
                          transform: translateX(-50%);
                          width: 0;
                          height: 0;
                          border-left: 8px solid transparent;
                          border-right: 8px solid transparent;
                          border-top: 8px solid #ffffff;
                        }
                      `,
                )}
              >
                <div
                  className={dynatic`
                    font-size: 12px;
                    color: #6b7280;
                    font-weight: 500;
                    margin-bottom: 6px;
                  `}
                >
                  {event.date}
                </div>
                <div
                  className={dynatic`
                    font-size: 14px;
                    font-weight: 600;
                    color: #1f2937;
                    margin-bottom: 6px;
                  `}
                >
                  {event.title}
                </div>
                <div
                  className={dynatic`
                    font-size: 12px;
                    color: #4b5563;
                    line-height: 1.4;
                  `}
                >
                  {event.description}
                </div>
              </div>
              <div
                className={combineStringsWithSpaces(
                  dynatic`
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    background: #3b82f6;
                    border: 3px solid #ffffff;
                    box-shadow: 0 0 0 3px #e2e8f0;
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
            </div>
          );
        })}
      </div>
    </div>
  );
};
