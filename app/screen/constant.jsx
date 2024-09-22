export const ROOM_TYPES = [
    { label: "Single", value: "Single" },
    { label: "Double", value: "Double" },
    { label: "Triple", value: "Triple" },
    { label: "Twin", value: "Twin" },
    { label: "King", value: "King" },
    { label: "Queen", value: "Queen" },
    { label: "Suite", value: "Suite" },
    { label: "Studio", value: "Studio" },
];

export const CARTMODEL = {
    bookingModel: {
        id: 0,
        referenceNumber: " ",
        bookingAMount: 0,
        bookingDate: new Date(),
        paidAmount: 0,
        status: "UnPaid",
        notes: "",
        guestId: 0,
    },
    paymentDetail: {
        cardNumber: "",
        nameOnCard: "",
        expiryYear: "",
        expiryMonth: "",
        cVV: "",
        transactionId: ""
    },
    lstEvent: [
        // {
        //     id: 0,
        //     eventId: 0,
        //     adultTickets: 0,
        //     childTickets: 0,
        //     itemTotalPrice: 0,
        //     strItemTotalPrice: "",
        //     index: 0,
        //     name: "",
        //     description: "",
        //     shortDescription: "",
        //     eventBookingDate: ""
        // }
    ],
    lstRoom: [
        // {
        //     id: 0,
        //     roomId: 0,
        //     checkInDate: new Date(0),
        //     checkOutDate: 0,
        //     itemTotalPrice: 0,  
        //     name: "",
        //     maxPerson: 0,
        //     noofNightStay: 0,
        //     index: 0
        // }
    ],
    lstRoomService: [
        // {
        //     roomId: 0,
        //     price: 0,
        //     description: "",    
        //     serviceName: "",
        //     requestDate: new Date(),
        //     index: 0
        // }
    ],
    lstGym: [
        // {
        //     gymId: 0,
        //     price: 0,
        //     monthRange: 1,    
        //     name: "",
        //     index: 0
        // }
    ],
    lstSpa: [
        // {
        //     spaId: 0,
        //     itemTotalPrice: 0,
        //     price:0,
        //     noOfPersons: "",    
        //     name: "",
        //     spaDate: new Date(),
        //     index: 0
        // }
    ],

};





