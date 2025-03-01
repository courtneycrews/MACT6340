import mysql from "mysql2";
import dotenv from "dotenv";
import fs from "fs";

let pool;

export async function connect() {
    let cString = 
    "mysql://" + 
    process.env.MYSQL_USER +
    ":" +
    process.env.MYSQL_PASSWORD +
    "@" +
    process.env.MYSQL_HOST +
    ":" +
    process.env.MYSQL_PORT +
    "/" +
    process.env.MYSQL_DATABASE +
    "?ssl={" + JSON.stringify({ ca: fs.readFileSync(process.env.MYSQL_CA_CERT_PATH) }) + "}"; // Add SSL Support

    pool = mysql.createPool({
        uri: cString, // Use connection string with SSL
        ssl: {
            rejectUnauthorized: true
        }
    }).promise();
}

export async function getAllProjects() {
    const [rows] = await pool.query('SELECT * FROM projects;');
    return rows;
}