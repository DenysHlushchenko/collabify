import { IncomingHttpHeaders } from 'http';
import { BADGE_CRITERIA } from 'src/constants';
import { BadgeCounts } from '../types';

export function extractTokenFromHeader(
  headers: IncomingHttpHeaders,
): string | undefined {
  const [type, token] = headers.authorization?.split(' ') ?? [];
  return type === 'Bearer' ? token : undefined;
}

interface BadgeParams {
  criteria: {
    type: keyof typeof BADGE_CRITERIA;
    value: number;
  }[];
}

export const assignBadges = (params: BadgeParams) => {
  const badgeCounts: BadgeCounts = {
    GOLD: 0,
    SILVER: 0,
    BRONZE: 0,
  };

  const { criteria } = params;

  criteria.forEach((item) => {
    const { type, value } = item;
    const badgeLevels: Record<string, number> = BADGE_CRITERIA[type];

    Object.keys(badgeLevels).forEach((level) => {
      if (value >= badgeLevels[level]) {
        badgeCounts[level as keyof BadgeCounts] += 1;
      }
    });
  });

  return badgeCounts;
};
