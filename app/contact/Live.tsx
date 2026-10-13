"use client";

import { useState, useSyncExternalStore } from "react";

const clock = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Asia/Tokyo",
});

function everyTenSeconds(onTick: () => void) {
  const id = setInterval(onTick, 10_000);
  return () => clearInterval(id);
}

/** The time in Tsujido. Empty until the browser is asked: the server's clock is the build's. */
export function TsujidoTime() {
  const time = useSyncExternalStore(
    everyTenSeconds,
    () => clock.format(new Date()),
    () => "",
  );
  return <time className="tabular-nums">{time}</time>;
}

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      aria-live="polite"
      onClick={() =>
        navigator.clipboard.writeText(text).then(
          () => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          },
          // Clipboard refused (permissions, insecure origin): the mail link still works.
          () => {},
        )
      }
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
