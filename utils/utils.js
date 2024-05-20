import nodemailer from "nodemailer";

export async function sendMessage(sub, txt) {
    console.log("MAIL_HOST:", process.env.MAIL_HOST);
    console.log("MAIL_PORT:", process.env.MAIL_PORT);
    console.log("MAIL_SECURE:", process.env.MAIL_SECURE);
    console.log("MAIL_USERNAME:", process.env.MAIL_USERNAME);
    console.log("MESSAGE_FROM:", process.env.MESSAGE_FROM);
    console.log("MESSAGE_TO:", process.env.MESSAGE_TO);

    let transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: parseInt(process.env.MAIL_PORT, 10),
        secure: process.env.MAIL_SECURE === 'true',
        auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD,
        },
        requireTLS: process.env.MAIL_TLS === 'true',
    });   
    let message = {
        from: process.env.MESSAGE_FROM,
        to: 'courtneymichelle.cc@gmail.com',  // process.env.MESSAGE_TO,
        subject: sub,
        text: txt,
    };

    if (!message.to) {
        console.error("No recipients defined.");
        return;
    }
    
    await transporter
        .sendMail(message)
        .then(() => {
            console.log("Message sent");
        })
        .catch((err) => {
            console.log("Message not sent - " + err);
        });
}