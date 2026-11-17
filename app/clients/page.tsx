import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { ClientsTable } from '@/components/clients/ClientsTable';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ClientsPage() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: clients } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false });

  return <ClientsTable clients={clients || []} />;
}
