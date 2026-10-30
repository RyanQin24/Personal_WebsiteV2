"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import styles from "./CateTerminal.module.css";

const commandError =
  "Error: Resource deadlock from Leo's connection.\nTTY reserved for Leo.\nMessage from Leo: Story is in progress. Do not interrupt my gf.";

export default function TerminalPrompt() {
  const [command, setCommand] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (history.length > 0) {
      inputRef.current?.scrollIntoView({ block: "nearest" });
    }
  }, [history.length]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!command.trim()) return;

    setHistory((previous) => [...previous, command]);
    setCommand("");
    inputRef.current?.focus({ preventScroll: true });
  }

  return (
    <div className={styles.interaction}>
      <div
        className={styles.commandHistory}
        role="log"
        aria-label="Terminal command history"
        aria-live="polite"
        aria-relevant="additions"
      >
        {history.map((entry, index) => (
          <div key={index}>
            <p className={styles.commandEcho}>
              <span className={styles.promptUser}>cate@cateos</span>
              <span className={styles.promptPath}>:~$</span> {entry}
            </p>
            <p className={styles.commandError}>{commandError}</p>
          </div>
        ))}
      </div>

      <form
        className={styles.prompt}
        onSubmit={handleSubmit}
        aria-label="Terminal command prompt"
      >
        <span className={styles.promptPrefix} aria-hidden="true">
          <span className={styles.promptUser}>cate@cateos</span>
          <span className={styles.promptPath}>:~$</span>
        </span>
        <input
          ref={inputRef}
          className={styles.commandInput}
          type="text"
          aria-label="Terminal command"
          placeholder="Type a command, then press Enter"
          value={command}
          onChange={(event) => setCommand(event.target.value)}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="send"
        />
      </form>
    </div>
  );
}
