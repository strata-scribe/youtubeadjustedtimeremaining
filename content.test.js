const { calculateAdjustedTime } = require('./content');

describe('calculateAdjustedTime', () => {
    it('correctly calculates adjusted remaining time for 1x speed', () => {
        expect(calculateAdjustedTime(100, 0, 1)).toBe(100);
    });

    it('correctly calculates adjusted remaining time for 0.25x speed', () => {
        expect(calculateAdjustedTime(100, 0, 0.25)).toBe(400);
    });

    it('correctly calculates adjusted remaining time for 1.25x speed', () => {
        expect(calculateAdjustedTime(100, 0, 1.25)).toBe(80);
    });

    it('correctly calculates adjusted remaining time for 1.5x speed', () => {
        expect(calculateAdjustedTime(100, 0, 1.5)).toBeCloseTo(66.6666, 3);
    });

    it('correctly calculates adjusted remaining time for 1.75x speed', () => {
        expect(calculateAdjustedTime(100, 0, 1.75)).toBeCloseTo(57.1428, 3);
    });

    it('correctly calculates adjusted remaining time for 2x speed', () => {
        expect(calculateAdjustedTime(100, 0, 2)).toBe(50);
    });

    it('correctly calculates adjusted remaining time for variable speed 1.1x', () => {
        expect(calculateAdjustedTime(110, 0, 1.1)).toBeCloseTo(100, 3);
    });

    it('correctly calculates adjusted remaining time for variable speed 2.5x', () => {
        expect(calculateAdjustedTime(100, 0, 2.5)).toBe(40);
    });

    it('handles non-zero current time correctly', () => {
        expect(calculateAdjustedTime(100, 20, 2)).toBe(40); // (100-20)/2
    });

    it('returns 0 if playback rate is 0 or missing', () => {
        expect(calculateAdjustedTime(100, 0, 0)).toBe(0);
        expect(calculateAdjustedTime(100, 0, undefined)).toBe(0);
        expect(calculateAdjustedTime(100, 0, null)).toBe(0);
    });

    it('returns 0 if duration is missing', () => {
        expect(calculateAdjustedTime(0, 0, 1)).toBe(0);
        expect(calculateAdjustedTime(undefined, 0, 1)).toBe(0);
        expect(calculateAdjustedTime(null, 0, 1)).toBe(0);
    });

    it('returns 0 if current time is greater than duration', () => {
        expect(calculateAdjustedTime(100, 150, 1)).toBe(0);
    });
});
