import NetworkClient from "./NetworkClient";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function NetworkPage() {
  return <NetworkClient />;
}
