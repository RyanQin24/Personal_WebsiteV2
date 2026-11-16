"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import styles from "./CateTerminal.module.css";

// Add commands and their responses here. Use lowercase command names.
const commandResponses: Record<string, string> = {
  help: "Appropriate Commands: \n - help: Displays this help message.\n AUTHOR Commands \n - about: Displays information about the author.\n - skills: Displays a list of skills and technologies.\n - contact: Displays contact information. \n Entertainment Commands \n - Leo: Displays how Leo hits on her Fiancé.",
};

const commandError =
  "Error: Invalid or forbiddden command.\n Forbidden command exception count: 0.\n Warning:Subsequent attempts will result in lethal force.";

function getCommandResponse(command: string) {
  const name = command.trim().toLowerCase();
  const isKnownCommand = Object.hasOwn(commandResponses, name);

  return {
    text: isKnownCommand ? commandResponses[name] : commandError,
    isError: !isKnownCommand,
  };
}

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
        {history.map((entry, index) => {
          const response = getCommandResponse(entry);

          return (
            <div key={index}>
              <p className={styles.commandEcho}>
                <span className={styles.promptUser}>cate@cateos</span>
                <span className={styles.promptPath}>:~$</span> {entry}
              </p>
              <p
                className={
                  response.isError
                    ? `${styles.commandResponse} ${styles.commandError}`
                    : styles.commandResponse
                }
              >
                {response.text}
              </p>
            </div>
          );
        })}
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
