import { useId } from "react";

type AnalogVuMeterProps = {
  channel: "L" | "R";
  /** Smoothed RMS level in dBFS. The parent owns the meter ballistics. */
  levelDb: number;
  /** Measured RMS level for the numeric readout, independent of the needle stop. */
  measuredDb?: number;
  /** The RMS level that corresponds to 0 VU. */
  calibrationDb?: number;
  peak?: boolean;
};

const MIN_ANGLE = -56;
const MAX_ANGLE = 56;
const MAX_AMPLITUDE = 10 ** (3 / 20);
const PIVOT = { x: 200, y: 284 };
const SCALE_MARKS = [-20, -10, -7, -5, -3, -2, -1, 0, 1, 2, 3];
const MINOR_MARKS = [-15, -8, -6, -4, -2.5, -1.5, -0.5, 0.5, 1.5, 2.5];

function amplitudeToAngle(amplitude: number) {
  const fraction = Math.min(1, Math.max(0, amplitude / MAX_AMPLITUDE));
  return MIN_ANGLE + fraction * (MAX_ANGLE - MIN_ANGLE);
}

/** Mechanical deflection is proportional to amplitude, so the dB scale is nonlinear. */
export function levelDbToVuAngle(levelDb: number, calibrationDb = -18) {
  const calibration = Number.isFinite(calibrationDb) ? calibrationDb : -18;
  const amplitude = Number.isNaN(levelDb)
    ? 0
    : 10 ** ((levelDb - calibration) / 20);
  return amplitudeToAngle(amplitude);
}

function point(angle: number, radius: number) {
  const radians = (angle * Math.PI) / 180;
  return {
    x: PIVOT.x + Math.sin(radians) * radius,
    y: PIVOT.y - Math.cos(radians) * radius,
  };
}

function arc(startAngle: number, endAngle: number, radius: number) {
  const start = point(startAngle, radius);
  const end = point(endAngle, radius);
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 0 1 ${end.x} ${end.y}`;
}

function label(vu: number) {
  return vu > 0 ? `+${vu}` : `${vu}`;
}

export default function AnalogVuMeter({
  channel,
  levelDb,
  measuredDb = levelDb,
  calibrationDb = -18,
  peak = false,
}: AnalogVuMeterProps) {
  const uniqueId = useId().replace(/:/g, "");
  const id = (part: string) => `vu-${uniqueId}-${part}`;
  const channelName = channel === "L" ? "Left" : "Right";
  const angle = levelDbToVuAngle(levelDb, calibrationDb);
  const readout = Number.isFinite(measuredDb) && measuredDb > -90
    ? `${measuredDb.toFixed(1)} dBFS`
    : "−∞ dBFS";
  const zeroAngle = levelDbToVuAngle(calibrationDb, calibrationDb);

  return (
    <svg
      viewBox="0 0 400 430"
      role="img"
      aria-labelledby={`${id("title")} ${id("description")}`}
      style={{ display: "block", width: "100%", height: "auto" }}
    >
      <title id={id("title")}>{`${channelName} channel analog VU meter`}</title>
      <desc id={id("description")}>
        {channelName} channel: {readout}. Zero VU is calibrated to {calibrationDb}
        {" "}dBFS RMS.{peak ? " Peak level detected." : ""}
      </desc>
      <defs>
        <linearGradient id={id("rim")} x1="0" y1="0" x2="0.85" y2="1">
          <stop offset="0" stopColor="#747975" />
          <stop offset="0.17" stopColor="#262b28" />
          <stop offset="0.55" stopColor="#090c0b" />
          <stop offset="0.84" stopColor="#333936" />
          <stop offset="1" stopColor="#111512" />
        </linearGradient>
        <radialGradient id={id("housing")} cx="0.38" cy="0.12" r="0.95">
          <stop offset="0" stopColor="#343a35" />
          <stop offset="0.58" stopColor="#171c18" />
          <stop offset="1" stopColor="#090d0b" />
        </radialGradient>
        <radialGradient id={id("face")} cx="0.47" cy="0.32" r="0.82">
          <stop offset="0" stopColor="#fff0bb" />
          <stop offset="0.55" stopColor="#efd18a" />
          <stop offset="0.87" stopColor="#d7ac5d" />
          <stop offset="1" stopColor="#ba8c42" />
        </radialGradient>
        <linearGradient id={id("glass")} x1="0" y1="0" x2="0.2" y2="1">
          <stop offset="0" stopColor="#fffbe5" stopOpacity="0.27" />
          <stop offset="0.5" stopColor="#fffbe5" stopOpacity="0" />
          <stop offset="1" stopColor="#fffbe5" stopOpacity="0.03" />
        </linearGradient>
        <radialGradient id={id("knob")} cx="0.35" cy="0.25" r="0.9">
          <stop offset="0" stopColor="#343c35" />
          <stop offset="1" stopColor="#090d0a" />
        </radialGradient>
        <filter id={id("shadow")} x="-20%" y="-20%" width="140%" height="145%">
          <feDropShadow dx="0" dy="7" stdDeviation="6" floodColor="#000" floodOpacity="0.4" />
        </filter>
      </defs>

      <g filter={`url(#${id("shadow")})`}>
        <circle cx="200" cy="202" r="184" fill={`url(#${id("rim")})`} />
        <circle cx="200" cy="202" r="177" fill={`url(#${id("housing")})`} stroke="#090d0a" strokeWidth="3" />
        <path
          d="M49 265 C25 211 30 142 72 94 C133 23 265 23 327 94 C369 141 375 211 351 265 C338 282 305 282 281 259 C235 216 165 216 119 259 C95 282 62 282 49 265 Z"
          fill={`url(#${id("face")})`}
          stroke="#090e0a"
          strokeWidth="7"
        />
        <path
          d="M47 257 C27 203 37 141 77 98 C140 31 258 31 322 98"
          fill="none"
          stroke="#e8dca9"
          strokeOpacity="0.18"
          strokeWidth="2"
        />
      </g>

      <g fontFamily="Georgia, 'Times New Roman', serif" fill="#30271d">
        <path d={arc(MIN_ANGLE, zeroAngle, 151)} fill="none" stroke="#3d3120" strokeWidth="3" />
        <path d={arc(zeroAngle, MAX_ANGLE, 151)} fill="none" stroke="#c9442f" strokeWidth="5" />
        {MINOR_MARKS.map((vu) => {
          const tickAngle = levelDbToVuAngle(calibrationDb + vu, calibrationDb);
          const start = point(tickAngle, 151);
          const end = point(tickAngle, 159);
          return (
            <line
              key={vu}
              x1={start.x}
              y1={start.y}
              x2={end.x}
              y2={end.y}
              stroke={vu > 0 ? "#c9442f" : "#3d3120"}
              strokeWidth="1.4"
            />
          );
        })}
        {SCALE_MARKS.map((vu) => {
          const tickAngle = levelDbToVuAngle(calibrationDb + vu, calibrationDb);
          const start = point(tickAngle, 150);
          const end = point(tickAngle, 165);
          const text = point(tickAngle, 181);
          const tickColor = vu > 0 ? "#c33e29" : "#30271d";
          return (
            <g key={vu}>
              <line x1={start.x} y1={start.y} x2={end.x} y2={end.y} stroke={tickColor} strokeWidth="2" />
              <text
                x={text.x}
                y={text.y}
                fill={tickColor}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="13"
                fontWeight="700"
                transform={`rotate(${tickAngle * 0.6} ${text.x} ${text.y})`}
              >
                {label(vu)}
              </text>
            </g>
          );
        })}
        {[20, 40, 60, 80, 100].map((percent) => {
          const tickAngle = amplitudeToAngle(percent / 100);
          const text = point(tickAngle, 127);
          return (
            <text key={percent} x={text.x} y={text.y} textAnchor="middle" fontSize="10" opacity="0.72">
              {percent}
            </text>
          );
        })}
        <text x="269" y="237" fontSize="31" fontWeight="700" letterSpacing="1">VU</text>
        <text x="65" y="244" fontSize="28">−</text>
        <text x="329" y="244" fontSize="28" fill="#cc442b">+</text>
        <text x="86" y="267" fontSize="9" fontWeight="700" opacity="0.7">RMS</text>
      </g>

      <g transform={`rotate(${angle} ${PIVOT.x} ${PIVOT.y})`}>
        <path d="M198.4 289 L198.8 138 Q200 132 201.2 138 L201.6 289 Z" fill="#17201a" />
        <path d="M200 280 L200 141" fill="none" stroke="#050906" strokeWidth="1.2" />
      </g>
      <path
        d="M49 265 C25 211 30 142 72 94 C133 23 265 23 327 94 C369 141 375 211 351 265 C338 282 305 282 281 259 C235 216 165 216 119 259 C95 282 62 282 49 265 Z"
        fill={`url(#${id("glass")})`}
        pointerEvents="none"
      />
      <circle cx="200" cy="284" r="29" fill="#080d09" stroke="#313b32" strokeWidth="3" />
      <circle cx="200" cy="284" r="20" fill={`url(#${id("knob")})`} />
      <path d="M184 270 Q199 258 216 270" fill="none" stroke="#6e786f" strokeOpacity="0.32" strokeWidth="1.5" />
      <circle cx="200" cy="337" r="21" fill="#080d09" stroke="#323a33" strokeWidth="2" />
      <circle cx="200" cy="337" r="16" fill={`url(#${id("knob")})`} />
      <circle cx="294" cy="312" r="5" fill={peak ? "#ff6855" : "#382b24"} stroke="#0a0f0b" strokeWidth="2" />
      <text x="294" y="329" textAnchor="middle" fill={peak ? "#e9a28b" : "#899185"} fontFamily="ui-monospace, monospace" fontSize="8" letterSpacing="1">PEAK</text>
      <text x="106" y="330" textAnchor="middle" fill="#b9b8a3" fontFamily="ui-monospace, monospace" fontSize="12" letterSpacing="2">{channelName.toUpperCase()}</text>
      <text x="200" y="413" textAnchor="middle" fill="#adc3ba" fontFamily="ui-monospace, monospace" fontSize="12" letterSpacing="1.5">{readout}</text>
    </svg>
  );
}
