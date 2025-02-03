import React, { useEffect, useState } from 'react';

const Navbar = () => {
    const [user, setUser] = useState(localStorage.getItem('userEmail'));

    useEffect(() => {
        const storedUser = localStorage.getItem('userEmail');
        if (storedUser) {
            setUser(storedUser);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        setUser(null);
    };

    return (
        <div className="navbar">
            <div className="dropdown" onClick={() => window.location.href = 'index.html'}>
                <div className="dropbtn">Home</div>
            </div>
            <div className="dropdown" onClick={() => window.location.href = 'menu.info.html'}>
                <div className="dropbtn">About</div>
            </div>
            <div className="dropdown">
                <div className="dropbtn">Untaped</div>
                <div className="dropdown-content">
                    <a href="tetris.html">Tetris</a>
                    <a href="snake.html">Snake</a>
                    <a href="game1.html">Matching</a>
                    <a href="2048.html">2048</a>
                </div>
            </div>
            <div className="search-container">
                <input type="text" id="searchInput" placeholder="Search games..." />
            </div>

            {/* Display User Info */}
            <div className="user-info">
                {user ? (
                    <>
                        <span>Welcome, {user}</span>
                        <button onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <a href="/login">Login</a>
                )}
            </div>
        </div>
    );
};

export default Navbar;