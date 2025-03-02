import mysql from "mysql2";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();  // Load .env variables

let pool;

export async function connect() {
    const sslCertPath = "/tmp/ca-certificate.crt";  // Temporary location in DO

    // If the certificate doesn't exist, create it dynamically
    if (!fs.existsSync(sslCertPath)) {
        console.log(`🛠 Writing SSL certificate to: ${sslCertPath}`);
        fs.writeFileSync(sslCertPath, process.env.MYSQL_CA_CERT.replace(/\\n/g, "\n"));
    }

    pool = mysql.createPool({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        port: process.env.MYSQL_PORT,
        ssl: {
            ca: fs.readFileSync(sslCertPath)
        }
    }).promise();
}

export async function getAllProjects() {
    const [rows] = await pool.query("SELECT * FROM projects;");
    return rows;
}