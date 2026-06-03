export type genericCellParam = { value: string }

export type numericCellParam = { value: number }

export type aircraftStatus = "Available" | "In Service" | "Maintenance" | "Retired" | "Reserved";

export type statusCellParam = { value: aircraftStatus }

export type aircraft = {
    id: string,
    type: {
        name: string,
        price: number,
        payloadKg: number,
        velocityKmh: number,
    },
};