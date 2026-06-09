/**
 * Reusable Typography components using Montserrat heading / DM Sans body styles.
 */

export function HeadingXL({ children, className = '' }) {
  return <h1 className={`heading-xl ${className}`}>{children}</h1>;
}

export function HeadingLG({ children, className = '' }) {
  return <h2 className={`heading-lg ${className}`}>{children}</h2>;
}

export function HeadingMD({ children, className = '' }) {
  return <h3 className={`heading-md ${className}`}>{children}</h3>;
}

export function HeadingSM({ children, className = '' }) {
  return <h4 className={`heading-sm ${className}`}>{children}</h4>;
}

export function BodyText({ children, className = '' }) {
  return <p className={`text-sm text-foreground leading-relaxed ${className}`}>{children}</p>;
}

export function MutedText({ children, className = '' }) {
  return <p className={`text-sm text-muted-foreground ${className}`}>{children}</p>;
}
