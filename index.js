// const puppeteer = require('puppeteer');
// const fs = require('fs');
// const path = require('path');
// const axios = require('axios');

// // Helper function to add a delay
// const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// // Helper function to sanitize file names (remove special characters)
// const sanitizeFileName = (fileName) => {
//     return fileName.replace(/[<>:"\/\\|?*]/g, '_'); // Replace invalid characters with '_'
// };

// (async () => {
//     const browser = await puppeteer.launch({ headless: false, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
//     const page = await browser.newPage();

//     // Set up a custom download folder
//     const downloadFolder = path.join(__dirname, 'downloads');
//     if (!fs.existsSync(downloadFolder)) {
//         fs.mkdirSync(downloadFolder);
//     }

//     // Navigate to the target URL
//     await page.goto('https://mphc.gov.in/judgement-orders', { waitUntil: 'networkidle2' });

//     console.log("Please manually select the category, input captcha, select date range, and hit submit.");
//     console.log("Press Enter in the terminal once the results are loaded in the table.");

//     // Wait for user input after manually submitting the form
//     process.stdin.once('data', async () => {
//         try {
//             // Wait for the div containing the table
//             await page.waitForSelector('div#get_Judge_Case_Afr', { visible: true });

//             console.log("Targeting <a> tags within the specific div and table...");
//             const baseUrl = 'https://mphc.gov.in'; // Base URL to resolve relative paths
//             const pdfLinks = await page.$$eval('div#get_Judge_Case_Afr table a', links =>
//                 links.map(link => ({
//                     href: link.href.startsWith('/') ? `${baseUrl}${link.href}` : link.href, // Convert to absolute URL
//                     text: link.textContent.trim(),
//                 }))
//             );
//             console.log(pdfLinks);

//             console.log(`Found ${pdfLinks.length} PDFs to download.`);

//             // Use Axios to download the PDFs directly
//             for (const [index, pdf] of pdfLinks.entries()) {
//                 console.log(`Processing ${index + 1}/${pdfLinks.length}: ${pdf.href}`);

//                 try {
//                     // Get the original file name from the URL or link text
//                     const fileName = pdf.href.split('/').pop(); // Extract file name from URL
//                     const sanitizedFileName = sanitizeFileName(fileName); // Sanitize file name to avoid invalid characters

//                     // Simulate the download action (send the request directly to the server)
//                     const response = await axios.get(pdf.href, {
//                         responseType: 'arraybuffer', // Ensure the response is treated as binary data
//                         headers: {
//                             'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36', // Mimic browser user-agent
//                             'Accept': 'application/pdf', // Accept PDF format
//                             'Accept-Encoding': 'gzip, deflate, br',
//                         },
//                         maxRedirects: 5, // Allow multiple redirects
//                     });

//                     if (response.status === 200) {
//                         const pdfPath = path.join(downloadFolder, sanitizedFileName);
//                         fs.writeFileSync(pdfPath, response.data); // Save PDF buffer to disk
//                         console.log(`Saved: ${pdfPath}`);
//                     } else {
//                         console.warn(`Skipped ${pdf.href}: Status ${response.status}`);
//                     }
//                 } catch (error) {
//                     console.error(`Error downloading ${pdf.href}:`, error);
//                 }

//                 await delay(5000); // Wait 5 seconds before the next download
//             }

//             console.log("All PDFs have been processed.");
//         } catch (error) {
//             console.error("An error occurred while scraping:", error);
//         } finally {
//             await browser.close();
//             process.exit();
//         }
//     });
// })();


// Without Pressing Enter in the Terminal


// const puppeteer = require('puppeteer');
// const fs = require('fs');
// const path = require('path');
// const axios = require('axios');

// // Helper function to add a delay
// const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// // Helper function to sanitize file names (remove special characters)
// const sanitizeFileName = (fileName) => {
//     return fileName.replace(/[<>:"/\\|?*]/g, '_'); // Replace invalid characters with '_'
// };

// const downloadPDFs = async () => {
//     const browser = await puppeteer.launch({ headless: false, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
//     const page = await browser.newPage();

//     // Set up a custom download folder
//     const downloadFolder = path.join(__dirname, 'downloads');
//     if (!fs.existsSync(downloadFolder)) {
//         fs.mkdirSync(downloadFolder);
//     }

//     // Navigate to the target URL
//     await page.goto('https://mphc.gov.in/judgement-orders', { waitUntil: 'networkidle2' });

//     let retryCount = 0;
//     const maxRetries = 3;

//     while (retryCount < maxRetries) {
//         try {
//             console.log("Please manually select the category, input captcha, select date range, and hit submit.");
//             console.log("Waiting for the results table to load...");

//             // Wait for the div containing the table
//             await page.waitForSelector('div#get_Judge_Case_Afr table', { visible: true, timeout: 60000 });

//             console.log("Targeting <a> tags within the specific div and table...");
//             const baseUrl = 'https://mphc.gov.in'; // Base URL to resolve relative paths
//             const pdfLinks = await page.$$eval('div#get_Judge_Case_Afr table a', links =>
//                 links.map(link => ({
//                     href: link.href.startsWith('/') ? `${baseUrl}${link.href}` : link.href, // Convert to absolute URL
//                     text: link.textContent.trim(),
//                 }))
//             );

//             if (pdfLinks.length === 0) {
//                 throw new Error("No PDF links found. Possibly due to invalid captcha.");
//             }

//             console.log(`Found ${pdfLinks.length} PDFs to download.`);

//             // Use Axios to download the PDFs directly
//             for (const [index, pdf] of pdfLinks.entries()) {
//                 console.log(`Processing ${index + 1}/${pdfLinks.length}: ${pdf.href}`);

//                 try {
//                     const fileName = sanitizeFileName(pdf.href.split('/').pop()); // Extract and sanitize file name
//                     const response = await axios.get(pdf.href, {
//                         responseType: 'arraybuffer',
//                         headers: {
//                             'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
//                             'Accept': 'application/pdf',
//                         },
//                     });

//                     if (response.status === 200) {
//                         const pdfPath = path.join(downloadFolder, fileName);
//                         fs.writeFileSync(pdfPath, response.data); // Save PDF buffer to disk
//                         console.log(`Saved: ${pdfPath}`);
//                     } else {
//                         console.warn(`Skipped ${pdf.href}: Status ${response.status}`);
//                     }
//                 } catch (error) {
//                     console.error(`Error downloading ${pdf.href}:`, error.message);
//                 }

//                 await delay(5000); // Wait 5 seconds before the next download
//             }

//             console.log("All PDFs have been processed.");
//             break; // Exit the retry loop on success
//         } catch (error) {
//             retryCount++;
//             console.warn(`Attempt ${retryCount} failed: ${error.message}`);
//             if (retryCount < maxRetries) {
//                 console.log("Reloading the page for another attempt...");
//                 await page.reload({ waitUntil: 'networkidle2' });
//             } else {
//                 console.error("Max retries reached. Exiting...");
//                 break;
//             }
//         }
//     }

//     await browser.close();
// };

// downloadPDFs().catch((error) => {
//     console.error("An error occurred during execution:", error);
// });





// CSV V2 

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Helper function to add a delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper function to sanitize file names (remove special characters)
const sanitizeFileName = (fileName) => {
    return fileName.replace(/[<>:"/\\|?*]/g, '_'); // Replace invalid characters with '_'
};

// Helper function to log download details to a CSV file
const logToCSV = (fileName) => {
    const logFilePath = path.join(__dirname, 'Downloaded Report.csv');
    const currentDate = new Date().toISOString().split('T')[0]; // Get only the date in YYYY-MM-DD format
    const logEntry = `"${currentDate}","${fileName}"\n`;

    if (!fs.existsSync(logFilePath)) {
        fs.writeFileSync(logFilePath, '"Downloaded date","File Name"\n', 'utf8'); // Add headers if file doesn't exist
    }

    fs.appendFileSync(logFilePath, logEntry, 'utf8'); // Append log entry to the file
};

const downloadPDFs = async () => {
    const browser = await puppeteer.launch({ headless: false, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();

    // Set up a custom download folder
    const downloadFolder = path.join(__dirname, 'downloads');
    if (!fs.existsSync(downloadFolder)) {
        fs.mkdirSync(downloadFolder);
    }

    // Navigate to the target URL
    await page.goto('https://mphc.gov.in/judgement-orders', { waitUntil: 'networkidle2' });

    let retryCount = 0;
    const maxRetries = 3;

    while (retryCount < maxRetries) {
        try {
            console.log("Please manually select the category, input captcha, select date range, and hit submit.");
            console.log("Waiting for the results table to load...");

            // Wait for the div containing the table
            await page.waitForSelector('div#get_Judge_Case_Afr table', { visible: true, timeout: 60000 });

            console.log("Targeting <a> tags within the specific div and table...");
            const baseUrl = 'https://mphc.gov.in'; // Base URL to resolve relative paths
            const pdfLinks = await page.$$eval('div#get_Judge_Case_Afr table a', links =>
                links.map(link => ({
                    href: link.href.startsWith('/') ? `${baseUrl}${link.href}` : link.href, // Convert to absolute URL
                    text: link.textContent.trim(),
                }))
            );

            if (pdfLinks.length === 0) {
                throw new Error("No PDF links found. Possibly due to invalid captcha.");
            }

            console.log(`Found ${pdfLinks.length} PDFs to download.`);

            // Use Axios to download the PDFs directly
            for (const [index, pdf] of pdfLinks.entries()) {
                console.log(`Processing ${index + 1}/${pdfLinks.length}: ${pdf.href}`);

                try {
                    const fileName = sanitizeFileName(pdf.href.split('/').pop()); // Extract and sanitize file name
                    const response = await axios.get(pdf.href, {
                        responseType: 'arraybuffer',
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                            'Accept': 'application/pdf',
                        },
                    });

                    if (response.status === 200) {
                        const pdfPath = path.join(downloadFolder, fileName);
                        fs.writeFileSync(pdfPath, response.data); // Save PDF buffer to disk
                        console.log(`Saved: ${pdfPath}`);

                        // Log the download to the CSV file
                        logToCSV(fileName);
                    } else {
                        console.warn(`Skipped ${pdf.href}: Status ${response.status}`);
                    }
                } catch (error) {
                    console.error(`Error downloading ${pdf.href}:`, error.message);
                }

                await delay(5000); // Wait 5 seconds before the next download
            }

            console.log("All PDFs have been processed.");
            break; // Exit the retry loop on success
        } catch (error) {
            retryCount++;
            console.warn(`Attempt ${retryCount} failed: ${error.message}`);
            if (retryCount < maxRetries) {
                console.log("Reloading the page for another attempt...");
                await page.reload({ waitUntil: 'networkidle2' });
            } else {
                console.error("Max retries reached. Exiting...");
                break;
            }
        }
    }

    await browser.close();
};

downloadPDFs().catch((error) => {
    console.error("An error occurred during execution:", error);
});
