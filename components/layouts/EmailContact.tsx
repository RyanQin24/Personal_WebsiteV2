"use client";

import { useId, useRef, useState } from "react";
import { Button } from "../ui/button";
import styles from "./Footer.module.css";

export default function EmailContact({ address, mailto }: { address: string; mailto: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);
  const headingId = useId();
  const [feedback, setFeedback] = useState("");
  const recipient = encodeURIComponent(address);

  function openContact() {
    setFeedback("");
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(address);
      setFeedback("Email address copied.");
    } catch {
      addressRef.current?.focus();
      addressRef.current?.select();
      setFeedback("The address is selected. Copy it with your keyboard or device menu.");
    }
  }

  return (
    <>
      <Button
        type="button"
        variant="link"
        className="px-2 text-muted-foreground font-semibold"
        onClick={openContact}
        aria-label={`Email ${address}`}
        aria-haspopup="dialog"
        title={`Email ${address}`}
      >
        <span className={styles.emailIcon} aria-hidden="true" />
      </Button>
      <dialog
        ref={dialogRef}
        className={styles.contactDialog}
        aria-labelledby={headingId}
        onClick={(event) => {
          if (event.target !== event.currentTarget) return;
          const bounds = event.currentTarget.getBoundingClientRect();
          if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) {
            event.currentTarget.close();
          }
        }}
      >
        <div className={styles.contactHeader}>
          <h2 id={headingId}>Email</h2>
          <button type="button" className={styles.closeContact} aria-label="Close email options" onClick={() => dialogRef.current?.close()}>×</button>
        </div>
        <input
          ref={addressRef}
          className={styles.contactAddress}
          aria-label="Email address"
          value={address}
          readOnly
          onFocus={(event) => event.currentTarget.select()}
        />
        <div className={styles.contactActions}>
          <button type="button" onClick={copyAddress}>Copy email</button>
          <a href={`https://mail.google.com/mail/?view=cm&fs=1&to=${recipient}`} target="_blank" rel="noopener noreferrer">Gmail <span aria-hidden="true">↗</span></a>
          <a href={`https://outlook.office.com/mail/deeplink/compose?to=${recipient}`} target="_blank" rel="noopener noreferrer">Outlook <span aria-hidden="true">↗</span></a>
          <a href={mailto}>Email app <span aria-hidden="true">↗</span></a>
        </div>
        {feedback && <p className={styles.contactFeedback} role="status">{feedback}</p>}
      </dialog>
    </>
  );
}
