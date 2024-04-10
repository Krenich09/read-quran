

const express = require('express');
const axios = require('axios');
const fs = require('fs');
const app = express();
const port = 3000;


app.use(express.static('public'));

app.get('/favicon.ico', (req, res) => res.status(204));

// Route to handle requests for Juz HTML pages
app.get('/:juzNumber(\\d+)', async (req, res) => {
    try {
        const juzNumber = req.params.juzNumber;
        const juzData = await fetchJuzData(juzNumber);

        // Render the HTML template with the Juz content
        const renderedHtml = renderJuzTemplate(juzData);

        // Send the rendered HTML to the client
        res.send(renderedHtml);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Function to fetch Juz data from the Al-Quran API
async function fetchJuzData(juzNumber) {
    try {
        const response = await axios.get(`http://api.alquran.cloud/v1/juz/${juzNumber}/quran-uthmani`);
        const juzData = response.data.data; // Access the 'data' object within the response
        return juzData;
    } catch (error) {
        throw new Error('Error fetching Juz data from the Al-Quran API ' + error);
    }
}


// Function to render the HTML template with the Juz content
function renderJuzTemplate(juzData) {
    // Start building the HTML content
    const juzNum = juzData.number;
    let htmlContent = `
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Kufi+Arabic:wght@100..900&display=swap" rel="stylesheet">

    <link href="https://fonts.googleapis.com/css2?family=Amiri+Quran&family=Reddit+Mono:wght@200..900&family=Reem+Kufi+Fun:wght@400..700&display=swap" rel="stylesheet">
        <title>Quran الجزء ${juzNum}</title>
        <link rel="stylesheet" href="/styles.css">
        <body>
        <div class="left-menu">
        </div>
        <div class="translation-content-left">
            <p id="translation-en"></p>
        </div>
        <div class="right-menu">
        </div>
        <div class="translation-content-right">
            <p id="translation-ar"></p>
        </div>
        <div class="content">
        `;
        htmlContent += `<script src="index.js"></script>`;
        
        // Loop through each ayah and append its number and text to the HTML content
        htmlContent += `<div class="ayah amiri-quran-regular">`
        juzData.ayahs.forEach(ayah => {
            if(ayah.surah.englishName == 'Al-Faatiha' || ayah.surah.englishName == 'At-Tawba')
            {
                if (ayah.numberInSurah === 1) { // Add Bismillah and Surah name for the first ayah of each surah
                    htmlContent += `<h2 class="title">${ayah.surah.name}</h2>`;
                }
                htmlContent += `<span class="arabic-text" onmouseover="changeDef(${ayah.number}, ${ayah.surah.number}, ${ayah.numberInSurah})" data-ayah="${ayah.numberInSurah}">${(ayah.text)} </span> <strong class="number">۝${romanToArabic(ayah.numberInSurah)}</strong>`;
            }
            else
            {
                if (ayah.numberInSurah === 1) { // Add Bismillah and Surah name for the first ayah of each surah
                    htmlContent += `<h2 class="title">${ayah.surah.name}</h2>`;
                    htmlContent += `<span class="title reem-kufi">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ </span>`;
                }
                if(ayah.numberInSurah == 1)
                {
                    htmlContent += `<span class="arabic-text" onmouseover="changeDef(${ayah.number}, ${ayah.surah.number}, ${ayah.numberInSurah})" data-ayah="${ayah.numberInSurah}">${(ayah.text).slice(38)}</span> <strong class="number">۝${romanToArabic(ayah.numberInSurah)}</strong>`;
                }
                else
                {
                    htmlContent += `<span class="arabic-text" onmouseover="changeDef(${ayah.number}, ${ayah.surah.number}, ${ayah.numberInSurah})" data-ayah="${ayah.numberInSurah}">${(ayah.text)}</span> <strong class="number">۝${romanToArabic(ayah.numberInSurah)}</strong>`;
                }
            }

        });
        htmlContent += `</div>`;
        // Close the content div
        htmlContent += `</body>`;
        
        return htmlContent;
    }
    
    
    function romanToArabic(romanNumber) {
        const arabChars = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
        let finalNum = '';
        while (romanNumber > 0) {
            let digit = romanNumber % 10;
        finalNum = arabChars[digit] + finalNum; // Adjusted to prepend digits correctly
        romanNumber = Math.floor(romanNumber / 10); // Corrected integer division
    }
    return finalNum;
}


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
