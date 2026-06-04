export type genericCellParam = { value: string }

export type numericCellParam = { value: number }

export type aircraftStatus = "Available" | "In Service" | "Maintenance" | "Retired" | "Reserved";

export type statusCellParam = { value: aircraftStatus }

export type aircraftType = {
    id: string,
    aircraft_type: string,
    price: number,
    payload_kg: number,
    velocity_kmh: number,
};

export type aircraftRowType = {
        id: string,
        name: string,
        price: number,
        payloadKg: number,
        velocityKmh: number,
}
