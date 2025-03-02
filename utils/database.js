import mysql from "mysql2";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

let pool;

export async function connect() {
    try {
        const sslCertPath = "/tmp/ca-certificate.crt";

        // Log before writing the SSL cert
        console.log(`🛠 Checking SSL certificate at: ${sslCertPath}`);
        
        if (!fs.existsSync(sslCertPath)) {
            console.log(`⚠️ SSL certificate missing, writing to file...`);
            fs.writeFileSync(sslCertPath, process.env.MYSQL_CA_CERT.replace(/\\n/g, "\n"));
        }

        console.log(`✅ SSL certificate exists. Attempting to connect to MySQL...`);

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

        console.log(`✅ Successfully connected to MySQL database.`);
    } catch (error) {
        console.error(`❌ Database connection failed:`, error);
    }
}

export async function getAllProjects() {
    try {
        const [rows] = await pool.query("SELECT * FROM projects;");
        return rows;
    } catch (error) {
        console.error(`❌ Query failed:`, error);
    }
}