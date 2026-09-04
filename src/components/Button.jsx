import { Link } from 'react-router-dom'
import Icon from './Icon.jsx'

// Island button with the nested "button-in-button" trailing pip.
export default function Button({
  to,
  href,
  children,
  variant = 'gold',
  icon = 'arrow',
  className = '',
  onClick,
  type,
  disabled,
  full,
}) {
  const cls = [
    'group btn',
    variant === 'gold' ? 'btn-gold' : 'btn-ghost',
    full ? 'w-full justify-center' : '',
    disabled ? 'opacity-55 pointer-events-none' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const inner = (
    <>
      <span className="text-[0.83rem] sm:text-[0.9rem]">{children}</span>
      {icon && (
        <span className="btn-pip">
          <Icon name={icon} className="w-[0.95rem] h-[0.95rem]" strokeWidth={1.7} />
        </span>
      )}
    </>
  )

  if (to) return <Link to={to} className={cls} onClick={onClick}>{inner}</Link>
  if (href)
    return (
      <a
        href={href}
        className={cls}
        onClick={onClick}
        {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {inner}
      </a>
    )
  return (
    <button type={type || 'button'} className={cls} onClick={onClick} disabled={disabled}>
      {inner}
    </button>
  )
}
