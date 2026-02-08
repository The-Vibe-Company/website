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
  let recentLogs: Array<{
    id: string | number
    status: string
    contentTitle: string
    sourceType: string
  }> = []

  try {
    const payload = await getPayload({ config })

    const [contentResult, toolsResult, mediaResult, logsResult] =
      await Promise.all([
        payload.find({ collection: 'content', limit: 0 }),
        payload.find({ collection: 'tools', limit: 0 }),
        payload.find({ collection: 'media', limit: 0 }),
        payload.find({ collection: 'ingestion-logs', limit: 0 }),
      ])

    const [publishedResult, draftResult, recentLogsResult] = await Promise.all([
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
        collection: 'ingestion-logs',
        limit: 5,
        sort: '-createdAt',
      }),
    ])

    stats = [
      {
        label: 'Content',
        value: contentResult.totalDocs,
        sub: `${publishedResult.totalDocs} published, ${draftResult.totalDocs} drafts`,
        color: '#2563eb',
      },
      {
        label: 'Tools',
        value: toolsResult.totalDocs,
        color: '#7c3aed',
      },
      {
        label: 'Media',
        value: mediaResult.totalDocs,
        color: '#059669',
      },
      {
        label: 'Ingestions',
        value: logsResult.totalDocs,
        color: '#d97706',
      },
    ]

    recentLogs = recentLogsResult.docs.map((doc) => ({
      id: doc.id,
      status: (doc.status as string) || 'received',
      contentTitle: (doc.contentTitle as string) || 'Untitled',
      sourceType: (doc.sourceType as string) || 'manual',
    }))
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

      {recentLogs.length > 0 && (
        <div className="dashboard-stats__recent">
          <h3 className="dashboard-stats__section-title">Recent Ingestions</h3>
          <ul className="dashboard-stats__list">
            {recentLogs.map((log) => (
              <li key={log.id} className="dashboard-stats__list-item">
                <span
                  className={`dashboard-stats__status dashboard-stats__status--${log.status}`}
                >
                  {log.status}
                </span>
                <span className="dashboard-stats__list-title">
                  {log.contentTitle}
                </span>
                <span className="dashboard-stats__list-source">
                  {log.sourceType}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
