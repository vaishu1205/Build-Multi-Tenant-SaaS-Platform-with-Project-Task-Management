// export default function StatCard({ title, value }) {
//   return (
//     <div
//       style={{
//         background: "var(--panel)",
//         padding: 20,
//         borderRadius: 8,
//         border: "1px solid var(--border)",
//       }}
//     >
//       <p style={{ color: "var(--muted)", fontSize: 13 }}>{title}</p>
//       <h2>{value}</h2>
//     </div>
//   );
// }

export default function StatCard({ title, value }) {
  return (
    <div
      style={{
        background: "var(--panel)",
        padding: 20,
        borderRadius: 10,
        border: "1px solid var(--border)",
        minHeight: 90,
      }}
    >
      <p
        style={{
          color: "var(--muted)",
          fontSize: 13,
          marginBottom: 6,
        }}
      >
        {title}
      </p>
      <h2 style={{ margin: 0 }}>{value}</h2>
    </div>
  );
}
