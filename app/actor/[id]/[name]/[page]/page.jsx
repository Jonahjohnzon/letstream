import ActorBody from './ActorBody'

export default async function Page({ params, searchParams }) {
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams
  return <ActorBody params={resolvedParams} searchParams={resolvedSearchParams} />
}