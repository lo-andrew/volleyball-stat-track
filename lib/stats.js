export function computeLifetimeStats(statlines = []) {
  return statlines.reduce(
    (acc, s) => {
      acc.kills.kill += s.kills?.kill || 0;
      acc.kills.totalAttempt += s.kills?.totalAttempt || 0;
      acc.kills.error += s.kills?.error || 0;

      acc.serves.ace += s.serves?.ace || 0;
      acc.serves.attempts += s.serves?.attempts || 0;
      acc.serves.error += s.serves?.error || 0;
      acc.serves.zero += s.serves?.zero || 0;

      acc.digs.digs += s.digStats?.successful || 0;
      acc.digs.error += s.digStats?.error || 0;

      acc.blocks.solo += s.blocks?.solo || 0;
      acc.blocks.assist += s.blocks?.assist || 0;
      acc.blocks.error += s.blocks?.error || 0;
      acc.blocks.zero += s.blocks?.zero || 0;

      acc.general.ballError += s.general?.ballError || 0;
      acc.general.setsPlayed += s.general?.setsPlayed || 0;

      acc.reception.errors += s.reception?.errors || 0;
      acc.reception.attempt += s.reception?.attempt || 0;
      acc.reception.zero += s.reception?.zero || 0;

      return acc;
    },
    {
      kills: { kill: 0, totalAttempt: 0, error: 0 },
      serves: { ace: 0, attempts: 0, error: 0, zero: 0 },
      digs: { digs: 0, error: 0 },
      blocks: { solo: 0, assist: 0, error: 0, zero: 0 },
      general: { ballError: 0, setsPlayed: 0 },
      reception: { errors: 0, attempt: 0, zero: 0 },
    }
  );
}
