const pricesDiv = document.getElementById("prices");

// Your API key from Reservoir
const apiKey = 'a5d354d5-d348-5802-be9a-147a5dd5caa8';  // Your actual API key

// Array of NFT collection contract addresses
const collectionContracts = [
    '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D',  // Example collection 1
    '0x1234567890abcdef1234567890abcdef12345678'   // Example collection 2
];

// Fetch and display data for each collection
collectionContracts.forEach(collectionContract => {
    fetch(`https://api.reservoir.tools/collections/v5?id=${collectionContract}`, {
        headers: {
            'x-api-key': apiKey
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.collections && data.collections.length > 0) {
            const collection = data.collections[0];
            const collectionName = collection.name;
            const collectionIcon = collection.image;

            // Create a new div for this collection
            const collectionDiv = document.createElement('div');
            collectionDiv.classList.add('collection');

            // Add collection icon and name
            const collectionHeader = `
                <div class="collection-header">
                    <img src="${collectionIcon}" alt="${collectionName}" width="50" height="50">
                    <h2>${collectionName}</h2>
                </div>`;
            collectionDiv.innerHTML = collectionHeader;

            // Create table structure
            const table = document.createElement('table');
            table.innerHTML = `
                <thead>
                    <tr>
                        <th>Token</th>
                        <th>Price (ETH)</th>
                        <th>Marketplace</th>
                    </tr>
                </thead>
                <tbody></tbody>
            `;
            collectionDiv.appendChild(table);

            // Append the collection div to the main pricesDiv
            pricesDiv.appendChild(collectionDiv);

            // Fetch token prices for this collection
            fetch(`https://api.reservoir.tools/tokens/v5?collection=${collectionContract}`, {
                headers: {
                    'x-api-key': apiKey
                }
            })
            .then(response => response.json())
            .then(data => {
                const tbody = table.querySelector('tbody');

                if (data.tokens) {
                    data.tokens.forEach(token => {
                        const price = token.market.floorAsk.price.amount.native || "Not for sale";
                        const title = token.token.name || `Token ID: ${token.token.tokenId}`;

                        // Add token data to the table
                        const row = `
                            <tr>
                                <td>${title}</td>
                                <td>${price} ETH</td>
                                <td>
                                    <a href="https://opensea.io/assets/${collectionContract}/${token.token.tokenId}" target="_blank">OpenSea</a> |
                                    <a href="https://blur.io/eth/asset/${collectionContract}/${token.token.tokenId}" target="_blank">Blur</a>
                                </td>
                            </tr>`;
                        tbody.innerHTML += row;
                    });
                } else {
                    tbody.innerHTML = "<tr><td colspan='3'>No tokens found for this collection.</td></tr>";
                }
            })
            .catch(error => {
                console.error('Error fetching token data:', error);
                tbody.innerHTML = "<tr><td colspan='3'>Failed to load prices.</td></tr>";
            });
        } else {
            pricesDiv.innerHTML += `<p>Failed to load collection data for contract: ${collectionContract}</p>`;
        }
    })
    .catch(error => {
        console.error('Error fetching collection data:', error);
        pricesDiv.innerHTML += `<p>Error fetching collection data for contract: ${collectionContract}</p>`;
    });
});
