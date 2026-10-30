import { Fragment } from "react";
import styles from "./CateTerminal.module.css";
import TerminalPrompt from "./TerminalPrompt";

const statusPattern = /(\[(?:STABLE|READY|ACTIVE|RECOVERED|OK)\]|FULLY OPERATIONAL\.)/g;

export default function CateTerminal({
  title,
  output,
}: {
  title: string;
  output: string;
}) {
  const lines = output.split(/\r?\n/);
  const noticeStart = lines.findIndex((line) =>
    line.includes("CRITICAL SECURITY SYSTEM NOTICE"),
  );
  const noticeEnd = lines.findIndex(
    (line, index) => index > noticeStart + 1 && /^-{3,}$/.test(line),
  );

  return (
    <section className={styles.terminal} aria-labelledby="cate-terminal-title">
      <header className={styles.header}>
        <div className={styles.lights} aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <h1 id="cate-terminal-title" className={styles.title}>
          {title}
        </h1>
        <span className={styles.session} aria-hidden="true">
          tty.cate
        </span>
      </header>

      <pre className={styles.output} aria-label="Cate BIOS startup output">
        <code>
          {lines.map((line, index) => {
            const isDivider = /^-{3,}$/.test(line);
            const isNotice =
              noticeStart >= 0 &&
              index >= noticeStart - 1 &&
              (noticeEnd < 0 || index <= noticeEnd);
            const className = [
              index === 0 || /^\[[^\]]+\]$/.test(line) ? styles.heading : "",
              isDivider ? styles.divider : "",
              isNotice ? styles.warning : "",
              line.includes("CRITICAL SECURITY SYSTEM NOTICE")
                ? styles.noticeTitle
                : "",
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <Fragment key={index}>
                <span className={className || undefined}>
                  {line.split(statusPattern).map((part, partIndex) =>
                    partIndex % 2 === 1 ? (
                      <span key={partIndex} className={styles.success}>
                        {part}
                      </span>
                    ) : (
                      part
                    ),
                  )}
                </span>
                {index < lines.length - 1 ? "\n" : null}
              </Fragment>
            );
          })}
        </code>
      </pre>

      <TerminalPrompt />
    </section>
  );
}
