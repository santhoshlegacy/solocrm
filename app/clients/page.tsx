import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function ClientsPage() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: clients } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false });

  const formatINR = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="w-full">
      <div className="bg-[#111111] border border-[#222] rounded-md mt-6 overflow-hidden">
        
        <div className="p-5 border-b border-[#222] flex items-center justify-between">
           <h2 className="text-white font-mono text-sm font-semibold tracking-wider">
             Client Accounts & Retention Health
           </h2>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#222] text-[#888] font-mono text-xs uppercase tracking-wider">
                <th className="p-4 font-normal">Client Company</th>
                <th className="p-4 font-normal">Lead Contact</th>
                <th className="p-4 font-normal">Status</th>
                <th className="p-4 text-right font-normal">Lifetime Value</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-[#222]">
              {clients?.map((client) => (
                <tr key={client.id} className="hover:bg-[#1a1a1a] transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                       <div className="h-8 w-8 rounded bg-[#222] text-[#cdcbca] flex items-center justify-center font-mono text-xs">
                         {client.name.substring(0, 2).toUpperCase()}
                       </div>
                       <span className="text-white font-medium">{client.name}</span>
                    </div>
                  </td>
                  
                  <td className="p-4">
                    <div className="text-white font-medium">{client.contact_person}</div>
                    <div className="text-[#666] text-sm font-mono mt-0.5">{client.email}</div>
                  </td>
                  
                  <td className="p-4">
                    <span className={`px-2.5 py-1 text-xs font-mono rounded ${
                      client.status === 'Active' 
                        ? 'bg-[#d41514]/10 text-[#d41514] border border-[#d41514]/20' 
                        : 'bg-[#222] text-[#888] border border-[#333]'
                    }`}>
                      {client.status === 'Active' ? '● Active' : client.status}
                    </span>
                  </td>
                  
                  <td className="p-4 text-right">
                    <span className="text-white font-mono tabular-nums font-semibold">
                      {formatINR(Number(client.total_billed))}
                    </span>
                  </td>
                </tr>
              ))}
              
              {(!clients || clients.length === 0) && (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-[#666] font-mono text-sm">
                    No clients found in the database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
