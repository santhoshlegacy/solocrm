export interface StatCardData {
  id: string;
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "neutral" | "negative";
  subtitle: string;
  sparkline?: number[];
  avatars?: { initials: string; bg: string; text: string }[];
  badge?: string;
  metaText?: string;
  iconName: string;
}

export interface RevenueDataPoint {
  period: string;
  revenue: number;
  target: number;
  formattedRevenue: string;
  isMilestone?: boolean;
}

export interface ActivityItem {
  id: string;
  title: string;
  client: string;
  description: string;
  time: string;
  amount?: string;
  statusBadge: {
    label: string;
    variant: "paid" | "contract" | "delivered" | "warning";
  };
  iconType: "payment" | "contract" | "upload" | "pending";
}

export interface DeadlineItem {
  id: string;
  title: string;
  dueDate: string;
  description: string;
  progress: number;
  colorVariant: "primary" | "secondary" | "dim";
}

export const USER_PROFILE = {
  name: "Santhosh",
  greeting: "Good morning, Santhosh !",
  tagline: "Here is what's happening across your freelance business today. You have 3 key deliverables due this week.",
  role: "Sr Designer & Dev",
  avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDOl-UfpB2sRVCpVdehKriTTMKtl3XqGCaO89IHgVndOl68i-Ax4SZpjR_saLBPmdwO1j3ebs7Qvy3kSFvSuBtkS34cafznEygh-OnF8DicD_AhDDOD-FN6RxqEJgKQkt9t6p7SPDaszpkOGxV9Qs_A22ailt1p4ffAF39_I1cyI98zK32zukw_FaJzHJZ80TmeLboYrY8kmr80pwC7kySmE3UHgKvkdV_DLusY",
  targetVelocity: "114%",
  hourlyRate: "$175.00/hr",
  collectionRate: "98.2%",
  annualForecast: "$210.5k",
};

export const STAT_CARDS: StatCardData[] = [
  {
    id: "balance",
    title: "Total Balance",
    value: "$48,250.00",
    change: "+14.2%",
    changeType: "positive",
    subtitle: "vs last billing cycle",
    iconName: "Wallet",
    sparkline: [25, 22, 26, 15, 18, 8, 3, 2],
  },
  {
    id: "mrr",
    title: "Monthly Recurring (MRR)",
    value: "$12,400.00",
    change: "+8.4%",
    changeType: "positive",
    subtitle: "3 ongoing retainers",
    iconName: "RefreshCw",
    sparkline: [28, 24, 20, 14, 8, 12, 3],
  },
  {
    id: "retainers",
    title: "Active Client Retainers",
    value: "6 Active",
    subtitle: "Capacity: 85%",
    badge: "2 Pending",
    iconName: "Users",
    avatars: [
      { initials: "AL", bg: "bg-stone-200", text: "text-stone-800" },
      { initials: "CD", bg: "bg-[#9CAF88]/20", text: "text-[#3D532E]" },
      { initials: "SM", bg: "bg-[#E8412C]/10", text: "text-[#E8412C]" },
      { initials: "+3", bg: "bg-stone-100", text: "text-stone-500" },
    ],
  },
  {
    id: "pending",
    title: "Pending Invoices",
    value: "$6,850.00",
    badge: "3 Drafts / Sent",
    subtitle: "Next due: Oct 28 (Apex)",
    iconName: "Clock",
  },
];

export const REVENUE_DATA: Record<"monthly" | "weekly" | "quarterly", RevenueDataPoint[]> = {
  monthly: [
    { period: "May", revenue: 18500, target: 16000, formattedRevenue: "$18.5k" },
    { period: "Jun", revenue: 22400, target: 19500, formattedRevenue: "$22.4k" },
    { period: "Jul", revenue: 28900, target: 24000, formattedRevenue: "$28.9k" },
    { period: "Aug", revenue: 34800, target: 29000, formattedRevenue: "$34.8k", isMilestone: true },
    { period: "Sep", revenue: 41200, target: 35000, formattedRevenue: "$41.2k" },
    { period: "Oct (Current)", revenue: 48250, target: 42000, formattedRevenue: "$48.25k" },
  ],
  weekly: [
    { period: "W1", revenue: 8200, target: 7500, formattedRevenue: "$8.2k" },
    { period: "W2", revenue: 11400, target: 9800, formattedRevenue: "$11.4k" },
    { period: "W3", revenue: 13900, target: 11200, formattedRevenue: "$13.9k" },
    { period: "W4", revenue: 14750, target: 13500, formattedRevenue: "$14.75k", isMilestone: true },
  ],
  quarterly: [
    { period: "Q1", revenue: 54000, target: 50000, formattedRevenue: "$54k" },
    { period: "Q2", revenue: 78000, target: 68000, formattedRevenue: "$78k" },
    { period: "Q3", revenue: 104900, target: 92000, formattedRevenue: "$104.9k", isMilestone: true },
    { period: "Q4 (Est.)", revenue: 138000, target: 120000, formattedRevenue: "$138k" },
  ],
};

export const ACTIVITIES: ActivityItem[] = [
  {
    id: "act-1",
    title: "Payment received: Milestone 2",
    client: "Apex Labs",
    description: "Design token extraction & mobile handoff",
    amount: "+$4,200.00",
    time: "Today, 11:20 AM",
    statusBadge: { label: "Paid", variant: "paid" },
    iconType: "payment",
  },
  {
    id: "act-2",
    title: "Contract Executed: Retainer Q4",
    client: "CyberDynamics Systems",
    description: "Senior UI Consulting ($8.5k/mo)",
    amount: "New Client",
    time: "Yesterday",
    statusBadge: { label: "Signed NDA", variant: "contract" },
    iconType: "contract",
  },
  {
    id: "act-3",
    title: "Design System Package Uploaded",
    client: "Hyperion Cloud",
    description: "Figma Library v2.3 + Web Components",
    amount: "32 Assets",
    time: "Oct 22",
    statusBadge: { label: "Delivered", variant: "delivered" },
    iconType: "upload",
  },
  {
    id: "act-4",
    title: "Milestone Payout Awaiting Approval",
    client: "StudioMono",
    description: "Brand Identity Final Specs",
    amount: "$2,650.00",
    time: "Oct 21",
    statusBadge: { label: "Due in 2d", variant: "warning" },
    iconType: "pending",
  },
];

export const DEADLINES: DeadlineItem[] = [
  {
    id: "dead-1",
    title: "Apex Labs Design Tokens",
    dueDate: "Tomorrow",
    description: "Exporting JSON variables & syncing dark mode specs",
    progress: 85,
    colorVariant: "primary",
  },
  {
    id: "dead-2",
    title: "StudioMono Prototype",
    dueDate: "Fri, Oct 27",
    description: "Interactive micro-animations & user flows",
    progress: 60,
    colorVariant: "secondary",
  },
  {
    id: "dead-3",
    title: "CyberDynamics Kickoff",
    dueDate: "Mon, Oct 30",
    description: "Scope baseline audit and Figma team configuration",
    progress: 25,
    colorVariant: "dim",
  },
];

