'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export const GenerateNavLink: React.FC = () => {
  const pathname = usePathname()
  const isActive = pathname === '/admin/generate'

  return (
    <div style={{ padding: '0 var(--gutter-h)' }}>
      <Link
        href="/admin/generate"
        className={`nav__link${isActive ? ' active' : ''}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 0',
          textDecoration: 'none',
          color: isActive ? 'var(--theme-text)' : 'var(--theme-elevation-600)',
          fontWeight: isActive ? 600 : 400,
          fontSize: '0.875rem',
          transition: 'color 0.15s',
        }}
      >
        <span aria-hidden="true" style={{ fontSize: '1.1em' }}>&#10024;</span>
        Generate Content
      </Link>
    </div>
  )
}
