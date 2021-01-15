const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'daniel.daniel.ran@gmail.com',
        subject: 'Welcom to Task manager, Thank for joining in!',
        text: `Welcom to the app, ${name}. Let me know how you get along with the app.`,
    });
};

const sendCancelEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'daniel.daniel.ran@gmail.com',
        subject: 'Good by',
        text: `Good by, ${name}. We hope you come back soon.`,
    });
};

module.exports = {
    sendWelcomeEmail,
    sendCancelEmail
}