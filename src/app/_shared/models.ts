export class Category {
    constructor(
        public name: string,
        public price: number,
        public img: string,
        public includedServices: number[],
        public optionalServices: number[]
    ) { }
}

export class Room {
    constructor(
        public name: string,
        public price: number
    ) { }
}

export class Payment {
    constructor(
        public cardName: string,  
        public cardNo: string,
        public expMonth: string,
        public expYear: string,
        public cvv: string,
        public amount: number,
        public billToCompany: boolean,
        public billByEmail: boolean,
        public billEmail: string,
        public isPaid: boolean,
        public isFixAmount: boolean,
        public fixAmount: number,
        public AskUserToCompleateData: boolean
    ) { }

}

export class Guest {
    constructor(
        public firstName: string, 
        public lastName: string, 
        public address: string, 
        public idNumber: string, 
        public postCode: string, 
        public city: string, 
        public country: string, 
        public email: string, 
        public mobile: string
    ) { }
}

export class PinRecovery {
    constructor(
        public bookingCode: string, 
        public roomNumber: string, 
        public password: string
    ) { }
}

export class Company {
    constructor (
      public companyName: string,
      public companyVatId: string,
      public companyAddress: string,
      public companyPostCode: string,
      public companyCity: string,
      public companyCountry: string,
      public companyEmail: string,
      public companyMobile: string
    ) { }
}

export class Booking {
    constructor(
        public bookingCode: string,
        public roomName: string,
        public section: string,
        public pin: string,
        public commonDoors: string[]
    ) { }
}

