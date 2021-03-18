const nodemailer = require('nodemailer');

async function sendEmail(req, res, next) {
  //wysłanie maila z linkiem do zmiany hasła
    if (req.resCode != 200) return next();
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'sqlmondo@gmail.com',
          pass: '*PASSWORD*'
        }
      });
      
      var mailOptions = {
        from: 'sqlmondo@gmail.com',
        to: req.body.email,
        subject: 'Reset hasła',
        text: `Twój link do zmiany hasła: http://46.41.137.179/api/forgot/${req.rand} \n This is an automatically generated email for a school project, if we accidently used your email, we're sorry, just send a reply, and we'll delete it from the databse`
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            req.resCode = 500;
            req.errMsg = error.message;
        }
        next();
      });
}
module.exports = sendEmail;