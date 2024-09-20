// Your API key from Reservoir
const apiKey = 'a5d354d5-d348-5802-be9a-147a5dd5caa8';  // Your actual API key

// Define the NFT collection contracts and corresponding table IDs
const collections = [
    { contract: '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D', tableId: 'bayc-table' }, // BAYC
    { contract: '0x8a90cab2b38dba80c64b7734e58ee1db38b8992e', tableId: 'doodles-table' }, // Doodles
    { contract: '0x1A92f7381B9F03921564a437210bB9396471050C', tableId: 'coolcats-table' }, // Cool Cats
    { contract: '0xED5AF388653567Af2F388E6224dC7C4b3241C544', tableId: 'azuki-table' }  // Azuki
];

// Function to fetch NFT data from Reservoir API for each collection
collections.forEach(({ contract, tableId }) => {
    const tableBody = document.querySelector(`#${tableId} tbody`);

    fetch(`https://api.reservoir.tools/tokens/v5?collection=${contract}`, {
        headers: {
            'x-api-key': apiKey  // Pass the API key in the headers
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log('Reservoir API Response:', data);

        // Check if tokens data exists in the response
        if (data.tokens) {
            // Loop through each token and display its price, name, and links to marketplaces
            data.tokens.forEach(token => {
                const price = token.market.floorAsk.price.amount.native || "Not for sale";  // Get price
                const title = token.token.name || `Token ID: ${token.token.tokenId}`;  // Get token name or ID
                const tokenId = token.token.tokenId;
                const tokenImage = token.token.image;  // Token image URL

                // Construct OpenSea and Blur URLs
                const lowerCaseContract = contract.toLowerCase();  // Ensure contract address is lowercase for Blur
                const openSeaUrl = `https://opensea.io/assets/ethereum/${contract}/${tokenId}`;
                const blurUrl = `https://blur.io/eth/asset/${lowerCaseContract}/${tokenId}`;

                // Add icons and links for OpenSea and Blur
                const row = `
                    <tr>
                        <td><img src="${tokenImage}" alt="${title}" width="50" height="50"></td>  <!-- Token image -->
                        <td>${title}</td>
                        <td>${price}</td>
                        <td>
                            <a href="${openSeaUrl}" target="_blank" style="margin-right: 10px;">
                                <img src="https://example.com/opensea-icon.png" alt="OpenSea" width="20" height="20">  <!-- OpenSea icon -->
                            </a>
                            <a href="${blurUrl}" target="_blank">
                                <img src="https://example.com/blur-icon.png" alt="Blur" width="20" height="20">  <!-- Blur icon -->
                            </a>
                        </td>
                    </tr>`;

                // Append the row to the table body
                tableBody.innerHTML += row;
            });
        } else {
            tableBody.innerHTML += `<tr><td colspan="4">No tokens found for this collection.</td></tr>`;
        }
    })
    .catch(error => {
        console.error('Error fetching data from Reservoir:', error);
        tableBody.innerHTML += `<tr><td colspan="4">Failed to load prices from Reservoir.</td></tr>`;
    });
});
