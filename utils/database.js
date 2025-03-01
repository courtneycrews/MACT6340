import mysql from "mysql2";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

let pool;

export async function connect() {
    // Ensure the SSL certificate path is resolved correctly
    const sslCertPath = path.resolve(process.env.MYSQL_CA_CERT_PATH);
    
    // Verify that the file exists before attempting to read it
    if (!fs.existsSync(sslCertPath)) {
        console.error(`SSL certificate file not found: ${sslCertPath}`);
        process.exit(1); // Stop the app if the certificate is missing
    }

    pool = mysql.createPool({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        port: process.env.MYSQL_PORT,
        ssl: {
            ca: fs.readFileSync(sslCertPath) // Read the SSL certificate
        }
    }).promise();
}

export async function getAllProjects() {
    const [rows] = await pool.query("SELECT * FROM projects;");
    return rows;
}