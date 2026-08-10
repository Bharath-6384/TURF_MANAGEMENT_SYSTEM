import { useState } from "react";
import { ExploreTurfsModel } from "../../../model/common/exploreturfsmodel";

export const ExploreTurfsService = () => {
  const [searchText, setSearchText]             = useState<string>("");
  const [selectedSport, setSelectedSport]       = useState<string>("All Sports");
  const [selectedLocation, setSelectedLocation] = useState<string>("All Locations");
  const [selectedPrice, setSelectedPrice]       = useState<string>("Price Range");

  const [turfs] = useState<ExploreTurfsModel.Turf[]>([
    {
      turfid: 1,
      turfname: "Kick Off Arena",
      location: "HSR Layout, Bengaluru",
      day_price: 800,
      night_price: 1200,
      email: "kickoffarena@gmail.com",
      contact_no: "9876543210",
      image: "/assets/turfs/football-turf.jpg",
    },
    {
      turfid: 2,
      turfname: "Sixers Cricket Hub",
      location: "Koramangala, Bengaluru",
      day_price: 900,
      night_price: 1400,
      email: "sixershub@gmail.com",
      contact_no: "9876543211",
      image: "/assets/turfs/cricket-turf.jpg",
    },
    {
      turfid: 3,
      turfname: "Smash Court",
      location: "Indiranagar, Bengaluru",
      day_price: 600,
      night_price: 900,
      email: "smashcourt@gmail.com",
      contact_no: "9876543212",
      image: "/assets/turfs/badminton-court.jpg",
    },
    {
      turfid: 4,
      turfname: "Green Field Turf",
      location: "Whitefield, Bengaluru",
      day_price: 700,
      night_price: 1100,
      email: "greenfield@gmail.com",
      contact_no: "9876543213",
      image: "/assets/turfs/football-turf-2.jpg",
    },
    {
      turfid: 5,
      turfname: "Hoop Arena",
      location: "JP Nagar, Bengaluru",
      day_price: 600,
      night_price: 900,
      email: "hooparena@gmail.com",
      contact_no: "9876543214",
      image: "/assets/turfs/basketball-court.jpg",
    },
    {
      turfid: 6,
      turfname: "Ace Tennis Court",
      location: "Jayanagar, Bengaluru",
      day_price: 500,
      night_price: 800,
      email: "acetennis@gmail.com",
      contact_no: "9876543215",
      image: "/assets/turfs/tennis-court.jpg",
    },
  ]);

  const filteredTurfs = turfs.filter((turf) => {
    const searchMatch =
      turf.turfname
        .toLowerCase()
        .includes(searchText.toLowerCase()) ||
      turf.location
        .toLowerCase()
        .includes(searchText.toLowerCase());

    return searchMatch;
  });

  const handleSearchText = (value: string) => {
    setSearchText(value);
  };

  return {
    turfs,
    filteredTurfs,
    searchText,
    selectedSport,
    selectedLocation,
    selectedPrice,
    handleSearchText,
    setSelectedSport,
    setSelectedLocation,
    setSelectedPrice,
  };
};