async function fetchData(link) {
    try {
        const response = await fetch(link);
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const data = await response.json(); // Parse the JSON response
            console.log(data); // Use the fetched data
        return data;
    } catch (error) {
        console.error(error.message);
    }
}

async function changeDef(ayahNumber, surahNum, ayaNumInSurah) {

    try {
        const response1 = await fetchData('https://api.alquran.cloud/v1/ayah/' + ayahNumber +'/en.asad');  
        const translation1 = response1.data.text;
        console.log(translation1);
        document.getElementById('translation-en').textContent = translation1;

        const response2 = await fetchData('https://quranenc.com/api/v1/translation/aya/arabic_moyassar/' + surahNum + '/' + ayaNumInSurah);  
        const translation2 = response2.result.translation +   '(' + response2.result.arabic_text + ')';
        console.log(translation2);
        document.getElementById('translation-ar').textContent = translation2;


    } catch (error) {
        console.error(error);
    }
}