type StatCardProps = {
  title: string;
  value: string | number;
  trend: string;
  trendType?: 'positive' | 'negative' | 'neutral';
  color?: string;
};

export default function StatCard({ title, value, trend, trendType = 'neutral', color }: StatCardProps) {
  return (
    <div className="stat-card glass">
      <div className="stat-title">{title}</div>
      <div className="stat-value" style={color ? { color } : {}}>{value}</div>
      <div className={`stat-trend ${trendType}`}>{trend}</div>
    </div>
  );
}
