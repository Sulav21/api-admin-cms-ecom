import nodemailer from 'nodemailer'

export const sendMail = async(emailData)=>{
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_SMTP,
        port: +process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });

     // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Laptop Store 👻" <owcftrfkwww7cnpk@ethereal.email>', // sender address
    to: "owcftrfkwww7cnpk@ethereal.email", // list of receivers
    subject: "Email Verification Code", // Subject line
    text: `Please verify your email through the link ${emailData.URL}`, // plain text body
    html: 
    `
    <p>Hi ${emailData.fName}</p>
    <br/>
    <br/>
    Please verify your email by following through the link below
    <br/>
    <br/>
    <a href='${emailData.URL}'> ${emailData.URL} </a>
    <br/>
    <br/>
    Kind regards,
    Laptop Store Team
    `, // html body
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}