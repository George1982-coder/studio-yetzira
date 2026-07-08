import { Fragment } from "react";
import { marqueeItems } from "@/lib/content";

export function Marquee() {
  return (
    <div className="marquee-wrap">
      <div className="marquee" aria-hidden="true">
        {[0, 1].map((round) => (
          <Fragment key={round}>
            {marqueeItems.map((item) => (
              <Fragment key={`${round}-${item}`}>
                <span>{item}</span>
                <span>·</span>
              </Fragment>
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
