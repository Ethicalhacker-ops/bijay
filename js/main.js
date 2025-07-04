document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const symbolInput = document.getElementById('symbolInput');
    const searchBtn = document.getElementById('searchBtn');
    const errorMsg = document.getElementById('errorMsg');
    const resultSection = document.getElementById('resultSection');
    const loadingSpinner = document.getElementById('loading');
    
    // Result elements
    const resultSymbol = document.getElementById('resultSymbol');
    const resultName = document.getElementById('resultName');
    const overallScore = document.getElementById('overallScore');
    const listeningScore = document.getElementById('listeningScore');
    const readingScore = document.getElementById('readingScore');
    const writingScore = document.getElementById('writingScore');
    const speakingScore = document.getElementById('speakingScore');
    const examinerComments = document.getElementById('examinerComments');
    const overallProgress = document.getElementById('overallProgress');
    
    // Skill details elements
    const listeningCorrect = document.getElementById('listeningCorrect');
    const readingCorrect = document.getElementById('readingCorrect');
    const writingTask = document.getElementById('writingTask');
    const writingCoherence = document.getElementById('writingCoherence');
    const speakingFluency = document.getElementById('speakingFluency');
    const speakingPronunciation = document.getElementById('speakingPronunciation');
    
    // Description elements
    const overallDescription = document.getElementById('overallDescription');
    const listeningDescription = document.getElementById('listeningDescription');
    const readingDescription = document.getElementById('readingDescription');
    const writingDescription = document.getElementById('writingDescription');
    const speakingDescription = document.getElementById('speakingDescription');
    
    // Event Listeners
    searchBtn.addEventListener('click', searchResult);
    symbolInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') searchResult();
    });

    /**
     * Handles the search functionality
     */
    function searchResult() {
        const symbol = symbolInput.value.trim().toUpperCase();
        
        // Validate input
        if (!symbol) {
            showError('Please enter a symbol number');
            symbolInput.focus();
            return;
        }

        if (!isValidSymbol(symbol)) {
            showError('Invalid symbol number format');
            return;
        }

        fetchResult(symbol);
    }

    /**
     * Validates the symbol number format
     * @param {string} symbol - The symbol number to validate
     * @returns {boolean} - True if valid, false otherwise
     */
    function isValidSymbol(symbol) {
        const regex = /^IELTS\d{7}$/;
        return regex.test(symbol);
    }

    /**
     * Fetches student results from the server
     * @param {string} symbol - The symbol number to search for
     */
    function fetchResult(symbol) {
        // Show loading state
        setLoadingState(true);
        
        // Simulate API call with timeout (replace with actual fetch in production)
        setTimeout(() => {
            try {
                // In a real application, you would fetch from an actual endpoint:
                // fetch(`/api/results/${symbol}`)
                // .then(handleResponse)
                // .catch(handleError);
                
                // Mock data for demonstration
                const mockData = {
                    students: [
                        {
                            symbol: "IELTS2023001",
                            name: "John Doe",
                            testDate: "30 June 2025",
                            testCenter: "Oli & Associates Birtamode",
                            overall: 7.5,
                            listening: 8.0,
                            reading: 7.5,
                            writing: 7.0,
                            speaking: 7.5,
                            listeningCorrect: 35,
                            readingCorrect: 33,
                            writingTask: 7.0,
                            writingCoherence: 7.5,
                            speakingFluency: 8.0,
                            speakingPronunciation: 7.5,
                            overallDescription: "Good user with operational command of the language with occasional inaccuracies and misunderstandings in some situations.",
                            listeningDescription: "Very good user with fully operational command of the language with only occasional unsystematic inaccuracies.",
                            readingDescription: "Good user with operational command of the language though with occasional inaccuracies and misunderstandings in some situations.",
                            writingDescription: "Good user with operational command of the language with occasional inaccuracies and misunderstandings in some situations.",
                            speakingDescription: "Good user with operational command of the language with occasional inaccuracies and misunderstandings in some situations.",
                            comments: "This candidate demonstrates a strong command of English with an overall band score of 7.5. The listening and speaking skills are particularly strong, showing good comprehension and fluency. The reading performance was solid with effective skimming and scanning techniques. Writing shows good task achievement but would benefit from more varied sentence structures and improved grammatical accuracy.",
                            status: "published"
                        },
                        {
                            symbol: "IELTS2023002",
                            name: "Jane Smith",
                            testDate: "30 June 2025",
                            testCenter: "Oli & Associates Birtamode",
                            overall: 6.5,
                            listening: 7.0,
                            reading: 6.5,
                            writing: 6.0,
                            speaking: 6.5,
                            listeningCorrect: 30,
                            readingCorrect: 29,
                            writingTask: 6.0,
                            writingCoherence: 6.5,
                            speakingFluency: 6.5,
                            speakingPronunciation: 6.5,
                            overallDescription: "Competent user with generally effective command of the language despite some inaccuracies and misunderstandings.",
                            listeningDescription: "Good user with operational command of the language with occasional inaccuracies and misunderstandings in some situations.",
                            readingDescription: "Competent user with generally effective command of the language despite some inaccuracies and misunderstandings.",
                            writingDescription: "Competent user with generally effective command of the language despite some inaccuracies and misunderstandings.",
                            speakingDescription: "Competent user with generally effective command of the language despite some inaccuracies and misunderstandings.",
                            comments: "The candidate shows competent English language skills with an overall band score of 6.5. There is room for improvement in all areas, particularly in writing where grammatical accuracy and task response could be strengthened. Listening and speaking skills are developing well but would benefit from more practice with complex vocabulary and structures.",
                            status: "published"
                        }
                    ]
                };

                const student = mockData.students.find(s => s.symbol === symbol);
                
                if (student) {
                    displayResult(student);
                } else {
                    showError('Symbol number not found');
                }
            } catch (error) {
                console.error('Error:', error);
                showError('An error occurred while processing your request');
            } finally {
                setLoadingState(false);
            }
        }, 1200); // Simulate network delay
    }

    /**
     * Displays the student result
     * @param {object} student - The student result data
     */
    function displayResult(student) {
        // Hide error message if shown
        errorMsg.style.display = 'none';
        
        // Set student info
        resultSymbol.textContent = student.symbol;
        resultName.textContent = student.name;
        
        // Set scores
        setBandScore(overallScore, student.overall);
        setBandScore(listeningScore, student.listening);
        setBandScore(readingScore, student.reading);
        setBandScore(writingScore, student.writing);
        setBandScore(speakingScore, student.speaking);
        
        // Set progress bar
        overallProgress.style.width = `${(student.overall / 9) * 100}%`;
        
        // Set skill details
        listeningCorrect.textContent = student.listeningCorrect;
        readingCorrect.textContent = student.readingCorrect;
        writingTask.textContent = student.writingTask;
        writingCoherence.textContent = student.writingCoherence;
        speakingFluency.textContent = student.speakingFluency;
        speakingPronunciation.textContent = student.speakingPronunciation;
        
        // Set descriptions
        overallDescription.textContent = student.overallDescription;
        listeningDescription.textContent = student.listeningDescription;
        readingDescription.textContent = student.readingDescription;
        writingDescription.textContent = student.writingDescription;
        speakingDescription.textContent = student.speakingDescription;
        
        // Set comments
        examinerComments.innerHTML = `<p>${student.comments}</p>`;
        
        // Update status badge
        updateStatusBadge(student.status);
        
        // Show result section with animation
        resultSection.classList.remove('hidden');
        resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    /**
     * Sets the band score and applies appropriate styling
     * @param {HTMLElement} element - The element to update
     * @param {number} score - The band score
     */
    function setBandScore(element, score) {
        if (!element || isNaN(score)) return;
        
        element.textContent = score;
        
        // Remove all band classes
        element.className = element.className.replace(/\bband-\d+\b/g, '');
        
        // Add appropriate band class
        const bandLevel = Math.floor(score);
        element.classList.add('band-score', `band-${bandLevel}`);
    }

    /**
     * Updates the status badge based on result status
     * @param {string} status - The result status
     */
    function updateStatusBadge(status) {
        const statusBadge = document.querySelector('.status-badge');
        if (!statusBadge) return;
        
        // Clear existing classes
        statusBadge.className = 'status-badge';
        
        // Add appropriate class based on status
        switch (status) {
            case 'published':
                statusBadge.classList.add('passed');
                statusBadge.textContent = 'Result Published';
                break;
            case 'pending':
                statusBadge.classList.add('pending');
                statusBadge.textContent = 'Result Pending';
                break;
            case 'withheld':
                statusBadge.classList.add('withheld');
                statusBadge.textContent = 'Result Withheld';
                break;
            default:
                statusBadge.classList.add('unknown');
                statusBadge.textContent = 'Status Unknown';
        }
    }

    /**
     * Shows an error message
     * @param {string} message - The error message to display
     */
    function showError(message) {
        errorMsg.textContent = message;
        errorMsg.style.display = 'block';
        resultSection.classList.add('hidden');
        
        // Scroll to error message if it's not visible
        errorMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    /**
     * Sets the loading state of the search button
     * @param {boolean} isLoading - Whether to show loading state
     */
    function setLoadingState(isLoading) {
        if (isLoading) {
            searchBtn.disabled = true;
            searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Searching...';
            loadingSpinner.classList.remove('hidden');
        } else {
            searchBtn.disabled = false;
            searchBtn.innerHTML = '<i class="fas fa-search"></i> Search';
            loadingSpinner.classList.add('hidden');
        }
    }

    // Initialize any default state
    symbolInput.focus();
});
