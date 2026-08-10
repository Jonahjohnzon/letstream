export function useLogout() {
  return async () => {
    const res = await fetch('/api/logout', { method: 'POST' })
    const data = await res.json()
    if (data.success) window.location.reload()
  }
}