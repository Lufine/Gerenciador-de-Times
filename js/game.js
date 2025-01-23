let scoreX = 0;
        let scoreY = 0;
        let timerInterval;
        let endTime;

        function startGame() {
            const goalLimit = parseInt(document.getElementById('goalLimit').value) || null;
            const startTime = new Date().getTime();
            endTime = startTime + 10 * 60 * 1000;

            clearInterval(timerInterval);
            timerInterval = setInterval(() => {
                const now = new Date().getTime();
                const remainingTime = Math.max(endTime - now, 0);
                const minutes = Math.floor(remainingTime / (1000 * 60));
                const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
                document.getElementById('timer').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

                if (remainingTime === 0) {
                    endGame('Tempo esgotado!');
                }
            }, 500);

            function checkGameEnd() {
                if (goalLimit && (scoreX >= goalLimit || scoreY >= goalLimit)) {
                    endGame('Gols máximos atingidos!');
                }
            }

            function incrementScore(team) {
                if (team === 'X') {
                    scoreX++;
                    document.getElementById('scoreX').textContent = scoreX;
                } else {
                    scoreY++;
                    document.getElementById('scoreY').textContent = scoreY;
                }
                checkGameEnd();
            }

            function endGame(message) {
                clearInterval(timerInterval);
                document.getElementById('alert').textContent = message;
                document.getElementById('alert').style.display = 'block';

                const whistle = new Audio('https://sounds-mp3.com/mp3/0003963.mp3');

                function playWhistle(times) {
                    let count = 0;
                    whistle.addEventListener('ended', function() {
                        count++;
                        if (count < times) {
                            setTimeout(() => {
                                whistle.play();
                            }, 250);
                        }
                    });
                    whistle.play();
                }
                
                playWhistle(3);
            
            }

            window.incrementScore = incrementScore;
        }

        window.startGame = startGame;

        function navigateTo(page) {
            if (page === 'home') {
                window.location.href = '../index.html';
            }
        }