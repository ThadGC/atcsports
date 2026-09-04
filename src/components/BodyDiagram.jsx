// Where to take each measurement. Drawn rather than shipped as an image so it stays
// crisp at any size and picks up the brand gold.
export default function BodyDiagram({ highlight = 'Chest', className = '' }) {
  const on = (m) => (highlight === m ? '#D9B86C' : 'rgba(255,255,255,0.35)')
  const lbl = (m) => (highlight === m ? '#F0DCA8' : 'rgba(255,255,255,0.5)')

  return (
    <svg
      viewBox="0 0 220 440"
      className={className}
      role="img"
      aria-label="Diagram showing where to measure chest, waist and inseam on the body"
    >
      {/* One clean silhouette rather than stacked outlines, so it stays readable small */}
      <g fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.42)" strokeWidth="2.5" strokeLinejoin="round">
        <ellipse cx="110" cy="36" rx="21" ry="27" />
        <path
          d="M110 66
             c-9 0-16 3-19 5l-30 13c-8 4-12 9-13 17l-8 51c-1 7 3 12 9 12s9-4 10-10l7-38 3 44
             c0 10-1 20-3 30l-6 32c-1 6 1 9 6 9h13l4 78c1 12 1 24 0 36-1 7 2 10 8 10h9c6 0 8-3 8-9l2-84
             h2l2 84c0 6 2 9 8 9h9c6 0 9-3 8-10-1-12-1-24 0-36l4-78h13c5 0 7-3 6-9l-6-32
             c-2-10-3-20-3-30l3-44 7 38c1 6 4 10 10 10s10-5 9-12l-8-51c-1-8-5-13-13-17l-30-13
             c-3-2-10-5-19-5Z"
        />
      </g>

      {/* chest */}
      <g>
        <line x1="64" y1="112" x2="156" y2="112" stroke={on('Chest')} strokeWidth="2.5" />
        <path d="M64 112l9-6m-9 6l9 6M156 112l-9-6m9 6l-9 6" fill="none" stroke={on('Chest')} strokeWidth="2.5" strokeLinecap="round" />
        <text x="110" y="103" textAnchor="middle" fill={lbl('Chest')} fontSize="17" fontWeight="700" fontFamily="Anton, Impact, sans-serif" letterSpacing="0.06em">
          CHEST
        </text>
      </g>

      {/* waist */}
      <g>
        <line x1="72" y1="176" x2="148" y2="176" stroke={on('Waist')} strokeWidth="2.5" />
        <path d="M72 176l9-6m-9 6l9 6M148 176l-9-6m9 6l-9 6" fill="none" stroke={on('Waist')} strokeWidth="2.5" strokeLinecap="round" />
        <text x="110" y="167" textAnchor="middle" fill={lbl('Waist')} fontSize="17" fontWeight="700" fontFamily="Anton, Impact, sans-serif" letterSpacing="0.06em">
          WAIST
        </text>
      </g>

      {/* inseam */}
      <g>
        <line x1="110" y1="252" x2="110" y2="392" stroke={on('Inseam')} strokeWidth="2.5" />
        <path d="M110 252l-6 9m6-9l6 9M110 392l-6-9m6 9l6-9" fill="none" stroke={on('Inseam')} strokeWidth="2.5" strokeLinecap="round" />
        <text
          x="110"
          y="322"
          textAnchor="middle"
          fill={lbl('Inseam')}
          fontSize="15"
          fontWeight="700"
          fontFamily="Anton, Impact, sans-serif"
          letterSpacing="0.06em"
          transform="rotate(-90 110 322)"
          dy="-6"
        >
          INSEAM
        </text>
      </g>
    </svg>
  )
}
