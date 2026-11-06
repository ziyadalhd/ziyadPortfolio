"use client";

import { Icon } from "./Icon";

/** Open the shared dialog from the contact actions. */
export function TwinTrigger({ label }: { label: string }) {
  return (
    <button
      className="twin-launcher"
      type="button"
      aria-haspopup="dialog"
      aria-controls="twin-dialog"
      onClick={(event) => {
        event.currentTarget.focus({ preventScroll: true });
        (
          document.getElementById("twin-dialog") as HTMLDialogElement
        ).showModal();
      }}
    >
      {label}
      <Icon name="chat" />
    </button>
  );
}
