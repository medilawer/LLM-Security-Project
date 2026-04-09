function StatCard({ label, value }) {
  return (
    <article className="stat-card" aria-label={label}>
      <p>{label}</p>
      <strong>{value}</strong>
    </article>
  );
}

export default StatCard;
