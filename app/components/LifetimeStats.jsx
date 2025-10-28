export default function LifetimeStats({ lifetimeStats }) {
  const hittingPercentage =
    lifetimeStats.kills.totalAttempt > 0
      ? ((lifetimeStats.kills.kill - lifetimeStats.kills.error) /
          lifetimeStats.kills.totalAttempt) *
        100
      : 0;

  return (
    <div className="overflow-x-auto mb-6">
      <table className="table table-compact table-zebra w-full">
        <thead>
          <tr>
            <th>Category</th>
            <th>Details / Totals</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Kills</td>
            <td>
              {lifetimeStats.kills.kill} / {lifetimeStats.kills.totalAttempt}{" "}
              (errors: {lifetimeStats.kills.error})
            </td>
          </tr>
          <tr>
            <td>Hitting %</td>
            <td>{hittingPercentage.toFixed(2)}%</td>
          </tr>
          <tr>
            <td>Serves</td>
            <td>
              ace: {lifetimeStats.serves.ace} / attempts{" "}
              {lifetimeStats.serves.attempts} (errors:{" "}
              {lifetimeStats.serves.error}, zeros: {lifetimeStats.serves.zero})
            </td>
          </tr>
          <tr>
            <td>Digs</td>
            <td>
              {lifetimeStats.digs.digs} (errors: {lifetimeStats.digs.error})
            </td>
          </tr>
          <tr>
            <td>Blocks</td>
            <td>
              solo: {lifetimeStats.blocks.solo}, assist:{" "}
              {lifetimeStats.blocks.assist} (errors:{" "}
              {lifetimeStats.blocks.error}, zeros: {lifetimeStats.blocks.zero})
            </td>
          </tr>
          <tr>
            <td>Reception</td>
            <td>
              errors: {lifetimeStats.reception.errors}, attempts:{" "}
              {lifetimeStats.reception.attempt}, zeros:{" "}
              {lifetimeStats.reception.zero}
            </td>
          </tr>
          <tr>
            <td>General</td>
            <td>
              ballError: {lifetimeStats.general.ballError}, setsPlayed:{" "}
              {lifetimeStats.general.setsPlayed}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
