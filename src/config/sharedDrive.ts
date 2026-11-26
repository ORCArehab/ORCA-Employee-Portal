/**
 * The company file server, published read-only on the office network. Its addresses only answer
 * on that network, so there's one link per way of being connected to it.
 */
export interface SharedDriveLink {
  id: string;
  /** How the employee is connected. */
  label: string;
  description: string;
  href: string;
}

export const sharedDriveLinks: SharedDriveLink[] = [
  {
    id: "office",
    label: "In the office",
    description: "On the office network (LAN or Wi-Fi).",
    href: "http://192.168.1.80:8080",
  },
  {
    id: "tailscale",
    label: "Tailscale",
    description: "Away from the office, with Tailscale connected.",
    href: "http://orca-server:8080",
  },
  {
    id: "wireguard",
    label: "WireGuard VPN",
    description: "Away from the office, with the WireGuard VPN connected.",
    href: "http://10.66.0.1:8080",
  },
];
