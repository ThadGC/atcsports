// Outer tray + inner plate. Nothing premium sits flat on the background.
export default function Bezel({ children, className = '', coreClassName = '' }) {
  return (
    <div className={['bezel', className].join(' ')}>
      <div className={['bezel-core h-full', coreClassName].join(' ')}>{children}</div>
    </div>
  )
}
