import { useState, useEffect } from 'react';


const useDarkMode = () =>{
    const [isDarkMode, setIsDarkMode] = useState(false)

    // Toggle dark mode 
    const toggleDarkMode = () => {
        console.log("click")
        setIsDarkMode(!isDarkMode);
        if (isDarkMode) {
          document.documentElement.classList.remove('dark');
          localStorage.removeItem('theme');
        } else {
          document.documentElement.classList.add('dark');
          localStorage.setItem('theme', 'dark');
        }
    };
    // Check system or saved theme preference on initial load
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
        setIsDarkMode(true);
        document.documentElement.classList.add('dark');
        } else {
        setIsDarkMode(false);
        document.documentElement.classList.remove('dark');
        }
    }, []);

    return { isDarkMode, toggleDarkMode };

}


export default useDarkMode;
