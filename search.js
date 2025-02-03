document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("searchInput");
    const gameContainer = document.querySelector(".container"); // Ensure correct container selection
    if (!gameContainer) return; // Prevents errors if container is missing

    const allHeadings = gameContainer.querySelectorAll("h3");

    searchInput.addEventListener("keyup", function () {
        const filter = searchInput.value.toLowerCase();

        allHeadings.forEach(heading => {
            const text = heading.textContent.toLowerCase();
            const box = heading.closest(".box");

            if (text.includes(filter)) {
                box.style.display = "block";
            } else {
                box.style.display = "none";
            }
        });
    });
});
function updatePopularGames() {
    let games = [
        // Your existing games array
    ];

    // Retrieve stored click counts and sort games by popularity
    games.forEach(game => {
        game.popularity = parseInt(localStorage.getItem(game.name) || 0);
    });

    games.sort((a, b) => b.popularity - a.popularity);

    // Select top 3 games
    let topGames = games.slice(0, 3);

    // Update the popular games section content
    let popularGamesSection = document.getElementById('popular-games');
    popularGamesSection.innerHTML = '';

    topGames.forEach(game => {
        let gameElement = document.createElement('div');
        gameElement.classList.add('box');
        gameElement.onclick = function() {
            trackPopularity(game.name, game.url);
        };
        gameElement.innerHTML = `
            <div class="box-content">
                <img src="${game.img}" alt="${game.name}">
                <h3>${game.name}</h3>
            </div>
        `;
        popularGamesSection.appendChild(gameElement);
    });
}

// Load popular games when the page loads
window.onload = function () {
    updatePopularGames();
};

document.addEventListener("DOMContentLoaded", function () {
    const gameWrapper = document.querySelector(".game-wrapper");
    const scrollAmount = 220; // Adjust as needed

    if (!gameWrapper) return; // Prevent errors if .game-wrapper doesn't exist

    // Scroll function
    window.scrollCarousel = function (direction) {
        gameWrapper.scrollBy({
            left: direction * scrollAmount,
            behavior: "smooth"
        });
    };
});