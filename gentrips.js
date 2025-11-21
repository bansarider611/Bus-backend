const mysql = require("mysql2/promise");
const moment = require("moment");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Bansari#611",   // CHANGE
  database: "BOOKING",          // CHANGE
});

function durationMinutes(distanceKm) {
  return Math.round(distanceKm); // km ≈ minutes
}

async function generate() {
  const conn = await pool.getConnection();
  try {
    const [templates] = await conn.query(`
      SELECT t.BUS_ID, t.ROUTE_ID, t.DEPARTURE_TIME, t.DAY_OF_WEEK, t.BASE_PRICE,
             r.DISTANCE_KM
      FROM TRIP_TEMPLATE t
      JOIN ROUTES r ON t.ROUTE_ID = r.ID;
    `);

    await conn.beginTransaction();

    for (const t of templates) {
      const map = { SUN:0, MON:1, TUE:2, WED:3, THU:4, FRI:5, SAT:6 };
      const nextDate = moment().add(1, "weeks").startOf("week").day(map[t.DAY_OF_WEEK]);

      const dep = moment(nextDate.format("YYYY-MM-DD") + " " + t.DEPARTURE_TIME);
      const arr = dep.clone().add(durationMinutes(t.DISTANCE_KM), "minutes");

      await conn.query(
        `INSERT INTO TRIPS (BUS_ID, ROUTE_ID, DEPARTURE_DATETIME, ARRIVAL_DATETIME, PRICE)
         VALUES (?, ?, ?, ?, ?)`,
        [t.BUS_ID, t.ROUTE_ID, dep.format("YYYY-MM-DD HH:mm:ss"), arr.format("YYYY-MM-DD HH:mm:ss"), t.BASE_PRICE]
      );
    }

    await conn.commit();
    console.log("TRIPS generated successfully ✔");
  } catch (err) {
    await conn.rollback();
    console.log("Error:", err);
  } finally {
    conn.release();
    process.exit(0);
  }
}

generate();
