async function handleZipFile(f) {
    console.log(`unzipping ${f.name}`);

    let zip = await JSZip.loadAsync(f);
    zip.forEach((relativePath, zipEntry) => {
        console.log(zipEntry.name);
    });
}

document.getElementById("zip-select").addEventListener('change', (event) => {
    if(event.target.files) {
        handleZipFile(event.target.files[0])
    }
});