export async function search() {

    const input = document.getElementById('search-input');
    if (!input) return;
    const query = input.value;

    const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    const results = await response.json();
    const resultsContainer = document.getElementById('results');
    if (!resultsContainer) return;
    resultsContainer.innerHTML = '';

    results.forEach(result => {
        const resultElement = document.createElement('div');
        resultElement.className = 'result';
        resultElement.innerHTML = `
            <h3>${result.title}</h3>
            <p>${result.description}</p>
            <a href="${result.url}" target="_blank">Read more</a>
        `;
        resultsContainer.appendChild(resultElement);
    });
}
