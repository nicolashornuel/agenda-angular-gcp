export interface Reservation {
    startAt: Date,
    endAt: Date,
    startPlace: string,
    endPlace: string,
    trainNumber: string,
    seatNumber?: string,
    travelReferency: string,
    price: number,
    subscriptionCard?: string,
    cancelation: string,
    fileLink: string
}
