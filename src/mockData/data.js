import {Link} from 'react-router-dom'

export const NavbarMenu =[
    {
        id:1,
        title:"Home",
        link:"/"
    },{
        id:2,
        title:"Photo & Amenities",
        link:"/gallery"
    },{
        id:3,
        title:"Rooms",
        link:"/Rooms"
    },{
  id: 4,
  title: "Services",
  link:"/Seva",
  SevaMenu: [
  { id: 30, title: "Food & Beverages", link: "/Seva/FoodBeverages", slug: "FoodBeverages" },
  { id: 31, title: "Events & Weddings", link: "/Seva/EventWedding", slug: "EventWedding" },
  { id: 32, title: "Guest Rooms", link: "/Seva/GuestRooms", slug: "GuestRooms" },
  { id: 33, title: "Special Offers", link: "/Seva/SpecialOffers", slug: "SpecialOffers" },
],
},{
        id:5,
        title:"Contact",
        link:"/Contact"
    },
 {
    id: 6,
    title: "Book Now",
    link: "/book",
  },
];


export const MobileNumber = " 91 8799866811 ";
