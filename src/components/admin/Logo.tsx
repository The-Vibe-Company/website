import React from 'react'

export const AdminLogo: React.FC = () => {
  return (
    <div className="admin-brand-logo">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/admin-logo.svg"
        alt="The Vibe Company"
        width={200}
        height={32}
      />
    </div>
  )
}
