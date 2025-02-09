document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("searchInput");
    const gameContainer = document.querySelector(".container");
    const gameBoxes = document.querySelectorAll(".box");
    const gameWrapper = document.querySelector(".game-wrapper");
    const scrollAmount = 220; // Adjust as needed

    if (!gameContainer) return; // Prevents errors if container doesn't exist

    searchInput.addEventListener("keyup", function () {
        const filter = searchInput.value.toLowerCase();
        let anyVisible = false;
        
        gameBoxes.forEach(box => {
            const heading = box.querySelector("h3");
            if (heading) {
                const text = heading.textContent.toLowerCase();
                if (text.includes(filter)) {
                    box.style.display = "block";
                    anyVisible = true;
                } else {
                    box.style.display = "none";
                }
            }
        });

        // Hide entire game container if no boxes match the search
        gameContainer.style.display = anyVisible ? "block" : "none";
    });

    // Scroll function for game carousel
    if (gameWrapper) {
        window.scrollCarousel = function (direction) {
            gameWrapper.scrollBy({
                left: direction * scrollAmount,
                behavior: "smooth"
            });
        };
    }
});

// Function to update popular games dynamically
function updatePopularGames() {
    let games = [
        { 
            name: 'Slope', 
            url: 'idk.html',
            img: 'https://cdn.prod.website-files.com/66f147eaaaf0038a5876d26d/66f14af7e26953f7a24865bd_slope_logo-2%202%402x.png' 
        },
        { 
            name: 'MOTO X3M', 
            url: 'MOTOX3M.html',
            img: 'https://img.poki-cdn.com/cdn-cgi/image/quality=78,width=1200,height=1200,fit=cover,f=png/2c6d5a46cdbceada277c870ce1c389ee.jpg'
        },
        { 
            name: 'Paper.io', 
            url: 'paper.html',
            img: 'https://slope-play.com/data/image/game/slope-logo-1.jpg'
        },
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
    if (!popularGamesSection) return; // Prevents errors if section doesn't exist
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
