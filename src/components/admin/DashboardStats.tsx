import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'

type StatCard = {
  label: string
  value: number
  sub?: string
  color: string
}

export const DashboardStats: React.FC = async () => {
  let stats: StatCard[] = []

  try {
    const payload = await getPayload({ config })

    const [contentResult, mediaResult, publishedResult, draftResult, learningResult, articleResult] = await Promise.all([
      payload.find({ collection: 'content', limit: 0 }),
      payload.find({ collection: 'media', limit: 0 }),
      payload.find({
        collection: 'content',
        limit: 0,
        where: { status: { equals: 'published' } },
      }),
      payload.find({
        collection: 'content',
        limit: 0,
        where: { status: { equals: 'draft' } },
      }),
      payload.find({
        collection: 'content',
        limit: 0,
        where: { type: { equals: 'daily' } },
      }),
      payload.find({
        collection: 'content',
        limit: 0,
        where: { type: { equals: 'article' } },
      }),
    ])

    stats = [
      {
        label: 'Entries',
        value: contentResult.totalDocs,
        sub: `${publishedResult.totalDocs} published, ${draftResult.totalDocs} drafts`,
        color: '#2563eb',
      },
      {
        label: 'Learnings',
        value: learningResult.totalDocs,
        color: '#d97706',
      },
      {
        label: 'Articles',
        value: articleResult.totalDocs,
        color: '#059669',
      },
      {
        label: 'Media',
        value: mediaResult.totalDocs,
        color: '#7c3aed',
      },
    ]
  } catch {
    // Silently degrade — show empty dashboard rather than crash
  }

  return (
    <div className="dashboard-stats">
      <div className="dashboard-stats__header">
        <p className="dashboard-stats__title">THE VIBE CO.</p>
        <h2 className="dashboard-stats__tagline">Content Command Center</h2>
      </div>

      <div className="dashboard-stats__grid">
        {stats.map((stat) => (
          <div key={stat.label} className="dashboard-stats__card">
            <div
              className="dashboard-stats__accent"
              style={{ backgroundColor: stat.color }}
            />
            <div className="dashboard-stats__value">{stat.value}</div>
            <div className="dashboard-stats__label">{stat.label}</div>
            {stat.sub && (
              <div className="dashboard-stats__sub">{stat.sub}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
