export interface Achievement {
    id: string;
    title: string;
    description: string;
    condition: (data: any) => boolean;
    xpReward: number;
}

const createTieredAchievement = (
    baseId: string,
    baseTitle: string,
    metric: 'completedPomodoros' | 'totalMinutes',
    tiers: number[],
    xpMulti: number
): Achievement[] => {
    return tiers.map(tier => ({
        id: `${baseId}_${tier}`,
        title: `${baseTitle} ${tier}`,
        description: `Reach ${tier} ${metric === 'completedPomodoros' ? 'Pomodoros' : 'Minutes'}.`,
        condition: (data) => data[metric] >= tier,
        xpReward: tier * xpMulti,
    }));
};

const pomodoroTiers = [1, 5, 10, 25, 50, 100, 200, 500, 1000];
const minuteTiers = [25, 100, 500, 1000, 5000, 10000, 25000, 50000];

export const ACHIEVEMENTS: Achievement[] = [
    ...createTieredAchievement('pomodoro', 'Focus Master', 'completedPomodoros', pomodoroTiers, 10),
    ...createTieredAchievement('minutes', 'Time Lord', 'totalMinutes', minuteTiers, 1),
    {
        id: 'deep_worker',
        title: 'Deep Worker',
        description: 'Complete 4 Pomodoros in a row.',
        condition: (data) => data.streak >= 4,
        xpReward: 200,
    },
];
