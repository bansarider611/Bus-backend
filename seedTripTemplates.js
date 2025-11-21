const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Bansari#611",   // CHANGE
  database: "BOOKING",         // CHANGE
});

// 15 buses
const buses = [
  { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 },
  { id: 6 }, { id: 7 }, { id: 8 }, { id: 9 }, { id: 10 },
  { id: 11 }, { id: 12 }, { id: 13 }, { id: 14 }, { id: 15 },
];

// 30 routes with distance
const routes = [
  { id: 1, distanceKm: 265.50 },
  { id: 2, distanceKm: 111.30 },
  { id: 3, distanceKm: 214.00 },
  { id: 4, distanceKm: 169.80 },
  { id: 5, distanceKm: 441.60 },
  { id: 6, distanceKm: 225.30 },
  { id: 7, distanceKm: 150.70 },
  { id: 8, distanceKm: 348.40 },
  { id: 9, distanceKm: 175.20 },
  { id: 10, distanceKm: 131.50 },
  { id: 11, distanceKm: 82.00 },
  { id: 12, distanceKm: 76.50 },
  { id: 13, distanceKm: 75.80 },
  { id: 14, distanceKm: 30.40 },
  { id: 15, distanceKm: 103.20 },
  { id: 16, distanceKm: 27.80 },
  { id: 17, distanceKm: 330.40 },
  { id: 18, distanceKm: 125.60 },
  { id: 19, distanceKm: 60.20 },
  { id: 20, distanceKm: 90.40 },
  { id: 21, distanceKm: 67.30 },
  { id: 22, distanceKm: 147.50 },
  { id: 23, distanceKm: 182.60 },
  { id: 24, distanceKm: 115.70 },
  { id: 25, distanceKm: 103.20 },
  { id: 26, distanceKm: 97.40 },
  { id: 27, distanceKm: 104.50 },
  { id: 28, distanceKm: 24.60 },
  { id: 29, distanceKm: 69.80 },
  { id: 30, distanceKm: 215.50 },
];

const daysOfWeek = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

// 5 buses per route (rotate)
function getBusesForRoute(routeIndex) {
  const selected = [];
  for (let k = 0; k < 5; k++) {
    const bus = buses[(routeIndex + k) % buses.length];
    selected.push(bus.id);
  }
  return selected;
}

// price: 1.9 Rs per km
function calculatePrice(distanceKm) {
  return Math.round(distanceKm * 1.9);
}

// helper: minutes -> "HH:MM:SS"
function toTimeString(totalMinutes) {
  let m = totalMinutes % (24 * 60); // keep in 0–1439
  const hh = Math.floor(m / 60);
  const mm = m % 60;
  const pad = (x) => (x < 10 ? "0" + x : "" + x);
  return `${pad(hh)}:${pad(mm)}:00`;
}

// build 10 departure times for a route:
// 5 morning (2h gap) + 5 evening (2.5h gap), small offset per route
function buildTimesForRoute(routeIndex) {
  const offset = routeIndex * 5; // minutes shift per route, just to make them different

  const morningStart = 6 * 60 + (offset % 60);      // between 06:00–06:59
  const eveningStart = 15 * 60 + (offset % 60);     // between 15:00–15:59

  const morningGap = 120; // 2 hours
  const eveningGap = 150; // 2.5 hours

  const times = [];

  // 5 morning times
  for (let i = 0; i < 5; i++) {
    const tMin = morningStart + i * morningGap;
    times.push(toTimeString(tMin));
  }

  // 5 evening times
  for (let i = 0; i < 5; i++) {
    const tMin = eveningStart + i * eveningGap;
    times.push(toTimeString(tMin));
  }

  return times; // length 10
}

async function seedTripTemplates() {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // optional: clear previous templates
    // await conn.query("DELETE FROM TRIP_TEMPLATE");

    for (let i = 0; i < routes.length; i++) {
      const route = routes[i];
      const routeIndex = i; // 0–29
      const busIds = getBusesForRoute(routeIndex);
      const basePrice = calculatePrice(route.distanceKm);
      const timeSlots = buildTimesForRoute(routeIndex); // 10 times

      // map: bus 0 => times[0] & times[5], bus 1 => times[1] & times[6], ...
      for (let b = 0; b < busIds.length; b++) {
        const busId = busIds[b];
        const morningTime = timeSlots[b];       // first 5
        const eveningTime = timeSlots[b + 5];   // next 5

        for (const day of daysOfWeek) {
          // morning trip
          await conn.query(
            `INSERT INTO TRIP_TEMPLATE
             (BUS_ID, ROUTE_ID, DEPARTURE_TIME, DAY_OF_WEEK, BASE_PRICE)
             VALUES (?, ?, ?, ?, ?)`,
            [busId, route.id, morningTime, day, basePrice]
          );

          // evening trip
          await conn.query(
            `INSERT INTO TRIP_TEMPLATE
             (BUS_ID, ROUTE_ID, DEPARTURE_TIME, DAY_OF_WEEK, BASE_PRICE)
             VALUES (?, ?, ?, ?, ?)`,
            [busId, route.id, eveningTime, day, basePrice]
          );
        }
      }
    }

    await conn.commit();
    console.log("✅ TRIP_TEMPLATE seeded with unique times for all routes!");
  } catch (err) {
    await conn.rollback();
    console.error("❌ Error seeding templates:", err);
  } finally {
    conn.release();
    process.exit(0);
  }
}

seedTripTemplates();
