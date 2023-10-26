const express = require('express');
const fs = require('fs');
const { Client } = require('ssh2');
const PDFDocument = require('pdfkit');
const nodemailer = require('nodemailer');

const app = express();
app.use(express.json());

// Configuration for SFTP server
const sftpConfig = {
  host: '216.250.120.223',
  port: 22,
  username: 'u1497067935',
  password: 'Authnew12345!@#$%',
};

// Configuration for email
const emailConfig = {
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'admin@prymedigital.com',
    pass: 'rnzbbfxnknduhcdv',
  },
};

function getCurrentDate() {
  const date = new Date();
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString();

  const formattedDate = `${month}-${day}-${year}`;

  return formattedDate;
}

const currentDate = getCurrentDate();

// Function to generate a file with content
function generateFile(content) {
  const date = new Date();
  const formattedDate = `${date.getFullYear()}${(date.getMonth() + 1)
    .toString()
    .padStart(2, '0')}${date
    .getDate()
    .toString()
    .padStart(2, '0')}`;
  const formattedTime = `${date
    .getHours()
    .toString()
    .padStart(2, '0')}${date
    .getMinutes()
    .toString()
    .padStart(2, '0')}${date.getSeconds().toString().padStart(2, '0')}`;
  const fileName = `SC${formattedDate}${formattedTime}.txt`;
  const filePath = `./${fileName}`;

  const fileContent = `First Name : ${content['your-first-name']}
Last Name : ${content['your-last-name']}
Address : ${content['your-address']}
City : ${content['your-city']}
State : ${content['your-state']}
Zipcode : ${content['your-zipcode']}
Phone Number : ${content['your-phone-number']}
Email : ${content['your-email']}
Insurance Company : ${content['your-insurance-company']}
Lic Plate : ${content['your-lic-plate']}
Vehicle Make/Model : ${content['your-vehicle-make-model']}
Preferred Contact Method : ${content['your-preferred-contact-method']}
Location : SC
Claim Number : ${content['your-claim-number']}



Terms & Conditions Agreement 

- REPAIR AUTHORIZATION:

      I understand that an express mechanic's lien is hereby acknowledged to secure payment. 
Should legal action be necessary to enforce collection, I will be responsible for all legal 
expenses.

      I understand that Superstar Collision Center LLC is not responsible for any damage to the vehicle resulting 
from any act of nature including, without limitation, damage caused by hail, wind, fire, or flood.

      I understand and agree that Superstar Collision Center LLC may provide my contact information to a third-party
organization that may contact me for the sole purpose of conducting a customer satisfaction survey.

      LIMITED WARRANTY. Subject to the specified exclusions and exceptions, Superstar Collision Center LLC provides a 
limited warranty for the work performed under this Repair Authorization. This limited warranty includes 
all repairs, paint and workmanship on sheet metal, frame, unitized chassis components, and mechanical 
items, but specifically excludes electric systems. This limited warranty is subject to any manufacturer’s 
warranty covering parts and materials. This limited warranty is non-transferable and valid for as long 
as I own the vehicle. During the limited warranty period, Superstar Collision Center LLC will repair or replace any defects 
caused by Superstar Collision Center LLC or its agents. All warranty repairs must be performed at one of Superstar Collision Center LLC 
facilities; any repairs or alterations to the vehicle performed non-Superstar Collision Center LLC facility in any manner 
whatsoever shall automatically void this limited warranty. This limited warranty shall not apply to 
repairs necessitated by any cause beyond the reasonable control of Superstar Collision Center LLC, including any defects, 
damage, or malfunctions caused by or resulting from unauthorized service or parts, improper or inadequate 
vehicle maintenance, alterations, accidents, modification or repairs, subsequent repairs performed by a 
party other than Superstar Collision Center LLC, abuse, misuse, neglect, acts of God, or environmental damage. 
THE WARRANTIES AS SET FORTH IN THIS SERVICE CONTRACT ARE IN LIEU OF ALL OTHER WARRANTIES, EXPRESS OR 
IMPLIED, INCLUDING, BUT NOT LIMITED TO, ANY IMPLIED WARRANTY OF MERCHANTABILITY OR FITNESS FOR A 
PARTICULAR PURPOSE.

      LIMITATION OF LIABILITY. In no event shall Superstar Collision Center LLC be liable for consequential, special, or 
indirect damages of any nature, and Superstar Collision Center LLC maximum liability shall be no greater than the amount 
actually paid to, and received by, Superstar Collision Center LLC for the services performed on the vehicle.

      MANDATORY ARBITRATION. I agree that all claims and disputes relating to this Repair Authorization 
(including the arbitrability of any issue), shall be exclusively, solely, and finally settled by confidential 
arbitration in the state in which the repair was performed, in accordance with the Federal Arbitration Act
(9 U.S.C. § 1 et. seq.), and the then-existing rules of the American Arbitration Association (“AAA”). There 
shall be a single arbitrator. The filing costs shall be the sole responsibility of the party filing arbitration. 
If the parties cannot agree on a single arbitrator, then each party shall select one individual to choose an 
arbitrator and those individuals shall agree on the arbitrator within 10 days. The arbitrator shall have the 
right to award or include in any award the specific performance of these terms and/or costs and expenses of 
the arbitration (including reasonable attorneys’fees) in accordance with what he or she deems just and equitable 
under the circumstances. The arbitrator’s decision may be reduced to a judgment in any competent jurisdiction.

      CLASS ACTION WAIVER. THE PARTIES WAIVE THE RIGHT TO ASSERT ANY AND ALL CLAIMS ARISING OUT OF OR RELATED 
TO THIS REPAIR AUTHORIZATION AGAINST THE OTHER PARTY AS A REPRESENTATIVE OR MEMBER IN ANY CLASS ACTION OR 
COLLECTIVE ACTION. THE PARTIES EXPRESSLY INTEND FOR ARBITRATION AS PROVIDED ABOVE TO BE THE SOLE AND EXCLUSIVE 
REMEDY FOR ANY AND ALL CLAIMS ARISING OUT OF OR RELATED TO THIS REPAIR AUTHORIZATION. THE PARTIES SHALL SUBMIT 
ONLY THEIR OWN, INDIVIDUAL CLAIMS IN ARBITRATION AND WILL NOT SEEK TO REPRESENT THE INTERESTS OF ANY OTHER 
INDIVIDUALS, AND NO CLAIMS WILL BE JOINED, CONSOLIDATED, OR HEARD TOGETHER WITH THE CLAIMS OF ANY OTHER INDIVIDUALS.

      ENTIRE AGREEMENT. The terms contained in this Repair Authorization constitute the entire agreement between you and 
Superstar Collision Center LLC. This Repair Authorization shall supersede all prior oral and written discussions, agreements, and 
understandings of the parties regarding the subject matter of this Authorization. No modification, amendment, supplement
to or waiver of this Repair Authorization or its terms and conditions shall be binding upon either party unless made in 
writing and signed by both you and an authorized manager of Superstar Collision Center LLC.

      I authorize any and all supplements payable direct to Superstar Collision Center LLC .  I authorize Superstar Collision Center LLC Downtown
 Car Care LLC POWER OF ATTORNEY TO SIGN supplement payments.


SIGNATURE: ${content['your-first-name']} ${content['your-last-name']}
DATE: ${currentDate}`;

  fs.writeFileSync(filePath, fileContent);

  return {
    fileName,
    filePath,
  };
}

// Function to generate a PDF file with content
function generatePDF(content) {
  function getCurrentDate() {
    const date = new Date();
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
  
    const formattedDate = `${month}-${day}-${year}`;
  
    return formattedDate;
  }
  
  const currentDate = getCurrentDate();
  
  // Function to generate a file with content

    const date = new Date();
    const formattedDate = `${date.getFullYear()}${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}${date
      .getDate()
      .toString()
      .padStart(2, '0')}`;
    const formattedTime = `${date
      .getHours()
      .toString()
      .padStart(2, '0')}${date
      .getMinutes()
      .toString()
      .padStart(2, '0')}${date.getSeconds().toString().padStart(2, '0')}`;
  const doc = new PDFDocument();

  // Generate the PDF content
  doc.fontSize(12);
  doc.text(`First Name : ${content['your-first-name']}`);
  doc.text(`Last Name : ${content['your-last-name']}`);
  doc.text(`Address : ${content['your-address']}`);
  doc.text(`City : ${content['your-city']}`);
  doc.text(`State : ${content['your-state']}`);
  doc.text(`Zipcode : ${content['your-zipcode']}`);
  doc.text(`Phone Number : ${content['your-phone-number']}`);
  doc.text(`Email : ${content['your-email']}`);
  doc.text(`Insurance Company : ${content['your-insurance-company']}`);
  doc.text(`Lic Plate : ${content['your-lic-plate']}`);
  doc.text(`Vehicle Make/Model : ${content['your-vehicle-make-model']}`);
  doc.text(`Preferred Contact Method : ${content['your-preferred-contact-method']}`);
  doc.text(`Location : SC`);
  doc.text(`Claim Number : ${content['your-claim-number']}`);
doc.moveDown();

  doc.text(`Terms & Conditions Agreement`);
  doc.text(`- REPAIR AUTHORIZATION`);
  doc.moveDown();

  doc.text(`I understand that an express mechanic’s lien is hereby acknowledged to secure payment. Should legal action be necessary to enforce collection, I will be responsible for all legal expenses.`);
  doc.moveDown();

  doc.text(`I understand that Superstar Collision Center LLC  is not responsible for any damage to the vehicle resulting from any act of nature including, without limitation, damage caused by hail, wind, fire, or flood.`);
  doc.moveDown();

  doc.text(`I understand and agree that Superstar Collision Center LLC  may provide my contact information to a third-party organisation that may contact me for the sole purpose of conducting a customer satisfaction survey.`);
  doc.moveDown();

  doc.text(`LIMITED WARRANTY. Subject to the specified exclusions and exceptions, Superstar Collision Center LLC  provides a limited warranty for the work performed under this Repair Authorization. This limited warranty includes all repairs, paint and workmanship on sheet metal, frame, unitized chassis components, and mechanical items, but specifically excludes electric systems. This limited warranty is subject to any manufacturer’s warranty covering parts and materials. This limited warranty is non-transferable and valid for as long as I own the vehicle. During the limited warranty period, Superstar Collision Center LLC  will repair or replace any defects caused by Superstar Collision Center LLC  or its agents. All warranty repairs must be performed at one of Superstar Collision Center LLC  facilities; any repairs or alterations to the vehicle performed Non-Superstar Collision Center LLC  facility in any manner whatsoever shall automatically void this limited warranty. This limited warranty shall not apply to repairs necessitated by any cause beyond the reasonable control of Superstar Collision Center LLC , including any defects, damage, or malfunctions caused by or resulting from unauthorized service or parts, improper or inadequate vehicle maintenance, alterations, accidents, modification or repairs, subsequent repairs performed by a party other than Superstar Collision Center LLC , abuse, misuse, neglect, acts of God, or environmental damage. THE WARRANTIES AS SET FORTH IN THIS SERVICE CONTRACT ARE IN LIEU OF ALL OTHER WARRANTIES, EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, ANY IMPLIED WARRANTY OF MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE.`);
  doc.moveDown();

  doc.text(`LIMITATION OF LIABILITY. In no event shall Superstar Collision Center LLC  be liable for consequential, special, or indirect damages of any nature, and Superstar Collision Center LLC  maximum liability shall be no greater than the amount actually paid to, and received by, Superstar Collision Center LLC  for the services performed on the vehicle.`);
  doc.moveDown();

  doc.text(`MANDATORY ARBITRATION. I agree that all claims and disputes relating to this Repair Authorization (including the arbitrability of any issue), shall be exclusively, solely, and finally settled by confidential arbitration in the state in which the repair was performed, in accordance with the Federal Arbitration Act(9 U.S.C. § 1 et. seq.), and the then-existing rules of the American Arbitration Association (“AAA”). There shall be a single arbitrator. The filing costs shall be the sole responsibility of the party filing arbitration. If the parties cannot agree on a single arbitrator, then each party shall select one individual to choose an arbitrator and those individuals shall agree on the arbitrator within 10 days. The arbitrator shall have the right to award or include in any award the specific performance of these terms and/or costs and expenses of the arbitration (including reasonable attorneys’fees) in accordance with what he or she deems just and equitable under the circumstances. The arbitrator’s decision may be reduced to a judgment in any competent jurisdiction.`);
  doc.moveDown();

  doc.text(`CLASS ACTION WAIVER. THE PARTIES WAIVE THE RIGHT TO ASSERT ANY AND ALL CLAIMS ARISING OUT OF OR RELATED TO THIS REPAIR AUTHORIZATION AGAINST THE OTHER PARTY AS A REPRESENTATIVE OR MEMBER IN ANY CLASS ACTION OR COLLECTIVE ACTION. THE PARTIES EXPRESSLY INTEND FOR ARBITRATION AS PROVIDED ABOVE TO BE THE SOLE AND EXCLUSIVE REMEDY FOR ANY AND ALL CLAIMS ARISING OUT OF OR RELATED TO THIS REPAIR AUTHORIZATION. THE PARTIES SHALL SUBMIT ONLY THEIR OWN, INDIVIDUAL CLAIMS IN ARBITRATION AND WILL NOT SEEK TO REPRESENT THE INTERESTS OF ANY OTHER INDIVIDUALS AND NO CLAIMS WILL BE JOINED, CONSOLIDATED, OR HEARD TOGETHER WITH THE CLAIMS OF ANY OTHER INDIVIDUALS.`);
  doc.moveDown();

  doc.text(`ENTIRE AGREEMENT. The terms contained in this Repair Authorization constitute the entire agreement between you and Superstar Collision Center LLC . This Repair Authorization shall supersede all prior oral and written discussions, agreements, and understandings of the parties regarding the subject matter of this Authorization. No modification, amendment, supplement to or waiver of this Repair Authorization or its terms and conditions shall be binding upon either party unless made in writing and signed by both you and an authorized manager of Superstar Collision Center LLC .`);
  doc.moveDown();

  doc.text(`I authorize any and all supplements payable direct to Superstar Collision Center LLC .  I authorize Superstar Collision Center LLC  POWER OF ATTORNEY TO SIGN supplement payments.`);
  doc.moveDown();


  doc.text(`SIGNATURE: ${content['your-first-name']} ${content['your-last-name']}`);
  doc.text(`DATE: ${currentDate}`);

  const fileName = `SC${formattedDate}${formattedTime}.pdf`;
  const filePath = `./${fileName}`;

  doc.pipe(fs.createWriteStream(filePath));
  doc.end();

  return {
    fileName,
    filePath,
  };
}

// Function to upload a file
function uploadFileToSFTP(localFilePath, remoteFilePath) {
  const conn = new Client();

  conn.on('ready', () => {
    conn.sftp((err, sftp) => {
      if (err) {
        console.error('Error creating SFTP session:', err);
        conn.end();
        return;
      }

      const writeStream = sftp.createWriteStream(remoteFilePath);

      writeStream.on('close', () => {
        console.log('File uploaded successfully');
        conn.end();
      });

      writeStream.on('error', (err) => {
        console.error('Error uploading file:', err);
        conn.end();
      });

      const readStream = fs.createReadStream(localFilePath);
      readStream.pipe(writeStream);
    });
  });

  conn.connect(sftpConfig);
}

// Function to send email with attachment
// async function sendEmailWithAttachment(toEmail, attachmentPath) {
//   const transporter = nodemailer.createTransport(emailConfig);

//   const mailOptions = {
//     from: emailConfig.auth.user,
//     to: toEmail,
//     cc: 'admin@prymedigital.com',
//     subject: 'PDF File',
//     text: 'Please find the attached PDF file.',
//     attachments: [
//       {
//         filename: attachmentPath.split('/').pop(),
//         path: attachmentPath,
//       },
//     ],
//   };

//   await transporter.sendMail(mailOptions);
// }

// Endpoint to handle the request
app.post('/generate-fileres', async (req, res) => {
  const fileContent = req.body;

  // Generate a PDF file with content
  const generatedpdfFile = generatePDF(fileContent);

    // Generate a file with content
    const generatedFile = generateFile(fileContent);

    const remoteFilePath = `/${generatedFile.fileName}`;

    const remotePdfPath = `/${generatedpdfFile.fileName}`;
  
    console.log(remoteFilePath)
  
    uploadFileToSFTP(generatedFile.filePath, remoteFilePath);

    uploadFileToSFTP(generatedpdfFile.filePath, remotePdfPath);

  // Send email with the generated PDF as an attachment
  // await sendEmailWithAttachment(fileContent['your-email'], generatedpdfFile.filePath);

  res.status(200).json({ message: 'File generated and uploaded successfully.' });
});

// Start the server
app.listen(5500, () => {
  console.log('Server is running on port 5500');
});
