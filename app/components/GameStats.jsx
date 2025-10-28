export default function GameStats({ statlines = [] }) {
  return (
    <div className="overflow-x-auto">
      <table className="table table-compact table-zebra w-full">
        <thead>
          <tr>
            <th>Game</th>
            <th>Kills</th>
            <th>Serves</th>
            <th>Digs</th>
            <th>Blocks</th>
            <th>Reception</th>
            <th>General</th>
          </tr>
        </thead>
        <tbody>
          {statlines.map((s) => (
            <tr key={s._id}>
              <td>
                {s.game
                  ? new Date(s.game.date).toLocaleDateString()
                  : "Unknown"}{" "}
                - {s.game?.teamA?.name || "?"} vs {s.game?.teamB?.name || "?"}
              </td>
              <td>
                {s.kills?.kill || 0} / {s.kills?.totalAttempt || 0} (errors:{" "}
                {s.kills?.error || 0})
              </td>
              <td>
                ace: {s.serves?.ace || 0} / {s.serves?.attempts || 0} (errors:{" "}
                {s.serves?.error || 0}, zeros: {s.serves?.zero || 0})
              </td>
              <td>
                {s.digStats?.successful || 0} | {s.digStats?.error || 0}
              </td>
              <td>
                solo: {s.blocks?.solo || 0} assist: {s.blocks?.assist || 0}{" "}
                (errors: {s.blocks?.error || 0}, zeros: {s.blocks?.zero || 0})
              </td>
              <td>
                errors: {s.reception?.errors || 0}, attempts:{" "}
                {s.reception?.attempt || 0}
              </td>
              <td>
                ballError: {s.general?.ballError || 0}, setsPlayed:{" "}
                {s.general?.setsPlayed || 0}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
