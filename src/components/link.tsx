import { Link as RouterLink } from 'joter'

/**
 * same as html <a>
 */
export type LinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement>

function isExternalLink(href?: string) {
  return href?.startsWith('http') ?? false
}

export function Link(props: LinkProps) {
  const { href, ...rest } = props
  if (isExternalLink(href)) {
    return <a {...props} target="_blank" rel="noopener noreferrer" />
  }
  return <RouterLink {...rest} href={href ?? ''} />
}
