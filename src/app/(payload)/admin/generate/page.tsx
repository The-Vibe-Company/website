import type { Metadata } from 'next'
import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'
import { redirect } from 'next/navigation'
import { GenerateForm } from './GenerateForm'

export const metadata: Metadata = {
  title: 'Generate Content | Payload Admin',
}

export default async function GeneratePage() {
  const payload = await getPayload({ config })
  const headers = await getHeaders()
  const { user } = await payload.auth({ headers })

  if (!user) {
    redirect('/admin/login')
  }

  return (
    <div className="generate-page">
      <div className="gutter--left gutter--right">
        <header className="generate-page__header">
          <h1>Generate Content</h1>
          <p className="generate-page__description">
            Collez du texte brut (notes, id&#233;es, brouillons) et Claude le transformera en contenu
            structur&#233; pr&#234;t &#224; publier.
          </p>
        </header>
        <GenerateForm />
      </div>
    </div>
  )
}
