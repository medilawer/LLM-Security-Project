function FeatureCard({ title, points }) {
  return (
    <article className="module-card">
      <h3>{title}</h3>
      <ul>
        {points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
    </article>
  );
}

export default FeatureCard;
