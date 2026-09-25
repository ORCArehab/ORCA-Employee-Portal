/** Google My Maps map of ORCA facilities, embedded on /facilities. */
export const facilitiesMap = {
  embedUrl:
    "https://www.google.com/maps/d/embed?mid=1BophzxrHhFcePdTzjAPp_fS7ZnMjNi4&ll=33.29735600413601%2C-121.40353080503206&z=5",
  viewUrl:
    "https://www.google.com/maps/d/viewer?mid=1BophzxrHhFcePdTzjAPp_fS7ZnMjNi4&ll=33.29735600413601%2C-121.40353080503206&z=5",
};

export interface Facility {
  name: string;
  /** Region grouping from ORCA's facility list; searchable. */
  region: string;
  /** Street address. Shown when a facility row is expanded; searchable. */
  address: string;
}

/** ORCA facilities, listed on /facilities below the map. */
export const facilities: Facility[] = [
  { name: "Community Care Center", region: "San Diego", address: "8665 La Mesa Blvd, La Mesa, CA 91942" },
  { name: "Stillwater Post Acute", region: "San Diego", address: "510 E Washington Ave, El Cajon, CA 92020" },
  { name: "The Shores Post Acute", region: "San Diego", address: "2828 Meadow Lark Dr, San Diego, CA 92123" },
  { name: "La Jolla Post Acute", region: "San Diego", address: "2552 Torrey Pines Rd, La Jolla, CA 92037" },
  { name: "Encinitas Nursing & Rehabilitation Center", region: "San Diego", address: "900 Santa Fe Dr, Encinitas, CA 92024" },
  { name: "Valle Vista Post Acute", region: "San Diego", address: "1025 W 2nd Ave, Escondido, CA 92025" },
  { name: "Jacob Healthcare Center", region: "San Diego", address: "4075 54th St, San Diego, CA 92105" },
  { name: "The Beach Post Acute", region: "Southern CA", address: "2725 Pacific Ave, Long Beach, CA 90806" },
  { name: "The Springs Post Acute", region: "Southern CA", address: "10625 Leffingwell Rd, Norwalk, CA 90650" },
  { name: "Beach Creek Post Acute", region: "Southern CA", address: "645 S Beach Blvd, Anaheim, CA 92804" },
  { name: "The Bellefontaine Healthcare Center", region: "Southern CA", address: "120 Bellefontaine St, Pasadena, CA 91105" },
  { name: "Meadow Creek Post Acute", region: "Southern CA", address: "7039 Alondra Blvd, Paramount, CA 90732" },
  { name: "Alderson Convalescent Hospital", region: "Southern CA", address: "124 Walnut St, Woodland, CA 95695" },
  { name: "The Canyons Post Acute", region: "Southern CA", address: "1350 Reche Canyon Rd, Colton, CA 92324" },
  { name: "Citrus Post Acute", region: "Southern CA", address: "1929 N Fairview St, Santa Ana, CA 92706" },
  { name: "The Grove Post Acute", region: "Southern CA", address: "12332 Garden Grove Blvd, Garden Grove, CA 92843" },
  { name: "The Orchards Post Acute", region: "Central CA", address: "730 34th St, Bakersfield, CA 93301" },
  { name: "Central Valley Post Acute / Valley Skilled Nursing Center", region: "Central CA", address: "515 E Orangeburg Ave, Modesto, CA 95350" },
  { name: "Sierra Vista Post Acute", region: "Central CA", address: "1900 Coffee Rd, Modesto, CA 95355" },
  { name: "The Ridge Post Acute", region: "Northern CA", address: "1355 Clayton Rd, San Jose, CA 95127" },
  { name: "The Vineyards Healthcare Center", region: "Northern CA", address: "76 Fenton St, Livermore, CA 94550" },
  { name: "Westwood Post Acute", region: "Northern CA", address: "1601 Petersen Ave, San Jose, CA 95129" },
  { name: "The Redwoods Post Acute", region: "Northern CA", address: "1267 Meridian Ave, San Jose, CA 95125" },
  { name: "Canyon Creek Post Acute", region: "Northern CA", address: "22103 Redwood Rd, Castro Valley, CA 94546" },
  { name: "Baywood Post Acute / Greenhills Manor", region: "Northern CA", address: "238 Virginia Ave, Campbell, CA 95008" },
  { name: "Vineyard Post Acute", region: "Northern CA", address: "101 Monroe St, Petaluma, CA 94954" },
  { name: "Avondale Villa Post Acute", region: "Northern CA", address: "788 Holmes St, Livermore, CA 94550" },
  { name: "Stratford Villa Post Acute", region: "Northern CA", address: "752 Holmes St, Livermore, CA 94550" },
  { name: "Lodi Creek Post Acute", region: "Northern CA", address: "321 W Turner Rd, Lodi, CA 95240" },
  { name: "Crystal Creek Post Acute", region: "Northern CA", address: "9289 Branstetter Pl, Stockton, CA 95209" },
  { name: "Santana Hills Healthcare Center", region: "Northern CA", address: "1250 S Winchester Blvd, San Jose, CA 95128" },
  { name: "RiverPointe Post Acute", region: "Northern CA", address: "6041 Fair Oaks Blvd, Carmichael, CA 95608" },
  { name: "Riverbank Post Acute", region: "Northern CA", address: "2649 Topeka St, Riverbank, CA 95367" },
  { name: "Clearwater Healthcare Center", region: "Northern CA", address: "1517 Knickerbocker Dr, Stockton, CA 95210" },
  { name: "Creekside Post Acute", region: "Northern CA", address: "3580 Payne Ave, San Jose, CA 95117" },
  { name: "West Tennessee Post Acute", region: "Tennessee", address: "597 West Forest Ave, Jackson, TN 38301" },
  { name: "Applingwood Post Acute", region: "Tennessee", address: "1536 Appling Care Lane, Cordova, TN 38016" },
  { name: "Harborview Post Acute", region: "Tennessee", address: "1513 North 2nd Street, Memphis, TN 38107" },
  { name: "Northbrooke Post Acute", region: "Tennessee", address: "121 Physicians Drive, Jackson, TN 38305" },
  { name: "Cypress Grove Post Acute", region: "Tennessee", address: "45 Forest Cove, Jackson, TN 38301" },
  { name: "Covington Post Acute", region: "Tennessee", address: "765 Bert Johnston Avenue, Covington, TN 38019" },
  { name: "Shelby Oaks Post Acute", region: "Tennessee", address: "5070 Sanderlin Avenue, Memphis, TN 38117" },
];
