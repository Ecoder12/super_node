const express = require('express');
const fs = require('fs');
const { Client } = require('ssh2');

const app = express();
app.use(express.json());

// Configuration for SFTP server
const sftpConfig = {
  host: '216.250.120.223',
  port: 22,
  username: 'u1497067935',
  password: 'Authnew12345!@#$%',
};
function getCurrentDate() {
  const date = new Date();
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString();

  const formattedDate = `${day}-${month}-${year}`;

  return formattedDate;
}

const currentDate = getCurrentDate();
// console.log(currentDate);

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
  const fileName = `SL${formattedDate}${formattedTime}.txt`;
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
Vehicle Make/Model : ${content['your-vehicle-make-model']}
Preferred Contact Method : ${content['your-preferred-contact-method']}
Location : SL
Claim Number : ${content['your-claim-number']}


Terms & Conditions Agreement

- REPAIR AUTHORIZATION
I authorize Silver Lining Collision, LLC, henceforth referred to as “Silver Lining” and its employees to repair the vehicle including the purchase and installation of all necessary parts, materials, labor, and subcontract services.

I understand that any repair estimate is based on a preliminary inspection and does not cover additional parts or labor that may be required to complete the repair.

I authorize Silver Lining and its employees to drive the vehicle for purposes including sublet repair, diagnosis, testing and/or inspection.

I agree to remove all valuables and personal property from the vehicle. I understand that Silver Lining will NOT be held responsible for the loss or theft of any personal property left in the vehicle.

I understand that Silver Lining Collision will NOT be responsible for any vehicle rental expenses (including insurance costs) incurred during the repair process.

I authorize my insurance company to pay Silver Lining directly for all repairs including any supplemental payments. I hereby appoint Silver Lining as a true and lawful attorney in fact to endorse, on my behalf, any insurance check received as payment for repairs performed on the vehicle.

Silver Lining will accept payment as follows: Insurance Checks (best method) and Credit Cards (Visa, MasterCard, Discover and AMEX). I am responsible for payment in full for the repairs except to the extent an insurance payment has been made. I understand that the vehicle will not be released to me until full payment has been made.

After 30 days from the completion of the repair (or such longer period as may be required under applicable state law), I understand that the vehicle may be deemed abandoned if I fail to retrieve the vehicle for any reason, including failing to make payment in full. In such an event, Silver Lining may, in its sole discretion, impound the vehicle with a third party or seek to declare the vehicle abandoned for purposes of resale. Any proceeds from such a resale shall first go to pay costs and then to the balance owed to Silver Lining.

I understand that an express mechanic's lien is hereby acknowledged to secure payment. Should legal action be necessary to enforce collection, I will be responsible for all legal expenses.

I understand that Silver Lining is not responsible for any damage to the vehicle resulting from any act of nature including, without limitation, damage caused by hail, wind, fire, or flood.

I understand and agree that Silver Lining may provide my contact information to a third-party organization that may contact me for the sole purpose of conducting a customer satisfaction survey.



SIGNATURE: ${content['your-first-name']} ${content['your-last-name']}
DATE: ${currentDate}`;

  fs.writeFileSync(filePath, fileContent);

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

// Endpoint to handle the request
app.post('/generate-file', (req, res) => {
  const fileContent = req.body;

  // Generate a file with content
  const generatedFile = generateFile(fileContent);

  const remoteFilePath = `/${generatedFile.fileName}`;

  console.log(remoteFilePath)

  uploadFileToSFTP(generatedFile.filePath, remoteFilePath);

  res.status(200).json({ message: 'File generated and uploaded successfully.' });
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
