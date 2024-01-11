import { Link as ReactRouterLink } from "react-router-dom"

/**
 * same as html <a>
 */
export type LinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement>

function isExternalLink(href?: string) {
  return href?.startsWith("http") ?? false
}

export function Link(props: LinkProps) {
  const { href, ...rest } = props
  if (isExternalLink(href)) {
    return <a {...props} target="_blank" rel="noopener noreferrer" />
  }
  return <ReactRouterLink {...rest} to={href ?? ""} />
}
