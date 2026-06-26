import { notFound, redirect } from 'next/navigation';

import { CONTENT_TYPES, getContentTypeByUrlSlug } from '@/lib/content-types';

export async function generateStaticParams() {
  return CONTENT_TYPES.filter((ct) => ct.showInNav).map((ct) => ({
    type: ct.urlSlug,
  }));
}

export const dynamicParams = true;

/**
 * The old per-type listing (e.g. /resources/articles) has been folded into the
 * redesigned /resources hub. Whatever type a visitor lands on, send them to the
 * new page so the old listing is never shown again.
 */
export default async function TypeListingPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  if (!getContentTypeByUrlSlug(type)) {
    notFound();
  }
  redirect('/resources');
}
