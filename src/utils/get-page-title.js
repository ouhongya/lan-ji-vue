import defaultSettings from '@/settings'

let title = defaultSettings.title || '揽集'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
