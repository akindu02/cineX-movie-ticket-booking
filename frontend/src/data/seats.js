
export const seatTypes = {
    STANDARD: 'standard',
    PREMIUM: 'premium',
    VIP: 'vip'
};

export const seatStatuses = {
    AVAILABLE: 'available',
    SELECTED: 'selected',
    SOLD: 'sold',
    HELD: 'held'
};

export const seatPriceMultipliers = {
    [seatTypes.STANDARD]: 1,
    [seatTypes.PREMIUM]: 1.3,
    [seatTypes.VIP]: 1.5
};

export const screenLayouts = {
    IMAX: { rows: 10, cols: 16, vipRows: 2, premiumRows: 3 },
    STANDARD: { rows: 8, cols: 12, vipRows: 1, premiumRows: 2 },
    GOLD: { rows: 6, cols: 8, vipRows: 6, premiumRows: 0 }, // All VIP
};

export const generateSeatMap = (screenType = 'STANDARD', seed = 123) => {
    const layout = Object.keys(screenLayouts).find(k => screenType.includes(k))
        ? screenLayouts[Object.keys(screenLayouts).find(k => screenType.includes(k))]
        : screenLayouts.STANDARD;

    const rows = [];
    const rowLabels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    for (let r = 0; r < layout.rows; r++) {
        const rowSeats = [];
        let rowType = seatTypes.STANDARD;

        // Determine row type (VIP at back, Premium in middle)
        if (r >= layout.rows - layout.vipRows) {
            rowType = seatTypes.VIP;
        } else if (r >= layout.rows - layout.vipRows - layout.premiumRows) {
            rowType = seatTypes.PREMIUM;
        }

        for (let c = 1; c <= layout.cols; c++) {
            // Simple pseudo-random status based on seed, row, and col
            // This ensures consistent sold seats for the same show
            const randomVal = ((seed * r * c) + c + r) % 100;
            let status = seatStatuses.AVAILABLE;

            if (randomVal < 15) status = seatStatuses.SOLD;
            else if (randomVal < 17) status = seatStatuses.HELD;

            rowSeats.push({
                id: `${rowLabels[r]}${c}`,
                row: rowLabels[r],
                number: c,
                type: rowType,
                status: status,
                priceMultiplier: seatPriceMultipliers[rowType]
            });
        }
        rows.push({ rowLabel: rowLabels[r], seats: rowSeats });
    }

    return {
        screenName: screenType,
        totalSeats: layout.rows * layout.cols,
        rows: rows
    };
};

export const calculateTotalPrice = (selectedSeatIds, basePrice, seatMap) => {
    let total = 0;
    selectedSeatIds.forEach(id => {
        // Find seat in map
        for (const row of seatMap.rows) {
            const seat = row.seats.find(s => s.id === id);
            if (seat) {
                total += basePrice * seat.priceMultiplier;
                break;
            }
        }
    });
    return Math.round(total);
};

export const seatTypeInfo = [
    { type: seatTypes.STANDARD, label: 'Standard', multiplier: 1, desc: 'Regular comfortable seating' },
    { type: seatTypes.PREMIUM, label: 'Premium', multiplier: 1.3, desc: 'Better viewing angle, extra legroom' },
    { type: seatTypes.VIP, label: 'VIP', multiplier: 1.5, desc: 'Best viewing experience, recliner seats' },
];
