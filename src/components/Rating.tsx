import styles from './rating.module.css'

interface RatingProps {
  value?: number
  onChange?: (value: number) => void
  size?: 'sm' | 'lg'
}

export default function Rating({ value = 0, onChange, size = 'sm' }: RatingProps) {
  const stars = [1, 2, 3, 4, 5]
  return (
    <span
      className={`${styles.rating} ${size === 'lg' ? styles.lg : ''}`}
      role={onChange ? 'radiogroup' : 'img'}
      aria-label={value ? `Rated ${value} out of 5` : 'Not rated'}
    >
      {stars.map((n) => {
        const filled = n <= value
        const glyph = filled ? '★' : '☆'
        return onChange ? (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={n === value}
            aria-label={`${n} star${n > 1 ? 's' : ''}`}
            className={filled ? styles.starOn : styles.starOff}
            // Clicking the current rating clears it.
            onClick={(e) => {
              e.stopPropagation()
              onChange(n === value ? 0 : n)
            }}
          >
            {glyph}
          </button>
        ) : (
          <span key={n} className={filled ? styles.starOn : styles.starOff} aria-hidden="true">
            {glyph}
          </span>
        )
      })}
    </span>
  )
}
