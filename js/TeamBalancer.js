const players = JSON.parse(localStorage.getItem('players')) || [];

const playersContainer = document.getElementById('playersContainer');
const teamsContainer = document.getElementById('teamsContainer');

document.getElementById('playerForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('playerName').value;
    const level = parseInt(document.getElementById('playerLevel').value);
    const type = document.getElementById('playerType').value;

    players.push({ name, level, type });
    localStorage.setItem('players', JSON.stringify(players));

    displayPlayers();
    this.reset();
});

document.getElementById('teamForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const playersPerTeam = parseInt(document.getElementById('playersPerTeam').value);
    const teams = balanceTeams(players, playersPerTeam);

    displayTeams(teams);
    localStorage.setItem('teams', JSON.stringify(teams));
});

function displayPlayers() {
    playersContainer.innerHTML = '';

    players.forEach((player, index) => {
        const playerDiv = document.createElement('div');
        playerDiv.classList.add('player');

        const playerInfo = document.createElement('span');
        playerInfo.textContent = `${player.name} (${player.type}, Nível: ${player.level})`;
        playerDiv.appendChild(playerInfo);

        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remover';
        removeBtn.classList.add('remove-btn');
        removeBtn.addEventListener('click', () => {
            players.splice(index, 1);
            localStorage.setItem('players', JSON.stringify(players));
            displayPlayers();
        });

        playerDiv.appendChild(removeBtn);
        playersContainer.appendChild(playerDiv);
    });
}

function balanceTeams(players, playersPerTeam) {
    const sortedPlayers = players.sort((a, b) => b.level - a.level); // Ordena os jogadores por nível
    const goalkeepers = sortedPlayers.filter(player => player.type === 'Goleiro');
    const fieldPlayers = sortedPlayers.filter(player => player.type === 'Jogador');

    const totalPlayers = goalkeepers.length + fieldPlayers.length;
    const totalTeams = Math.ceil(totalPlayers / playersPerTeam);
    const teams = Array.from({ length: totalTeams }, () => []);

    // Distribuir goleiros nos times
    goalkeepers.forEach((goalkeeper, index) => {
        const teamIndex = index % totalTeams;
        teams[teamIndex].push(goalkeeper);
    });

    // Distribuir jogadores de campo nos times de forma balanceada, priorizando os três primeiros
    fieldPlayers.forEach((player, index) => {
        const teamIndex = index % totalTeams;
        // Priorizar os três primeiros times até atingirem o número máximo de jogadores
        if (teamIndex < 3 && teams[teamIndex].length < playersPerTeam) {
            teams[teamIndex].push(player);
        } else {
            teams[teamIndex].push(player);
        }
    });

    // Distribuir jogadores restantes de forma equilibrada
    let remainingPlayers = fieldPlayers.slice(totalTeams * playersPerTeam - goalkeepers.length);
    let teamIndex = 0;
    while (remainingPlayers.length > 0) {
        teams[teamIndex].push(remainingPlayers.shift());
        teamIndex = (teamIndex + 1) % totalTeams;
    }

    return teams;
}

function displayTeams(teams) {
    teamsContainer.innerHTML = '';

    teams.forEach((team, index) => {
        const teamDiv = document.createElement('div');
        teamDiv.classList.add('team');

        const teamTitle = document.createElement('h3');
        teamTitle.textContent = `Time ${index + 1}`;
        teamDiv.appendChild(teamTitle);

        team.forEach(player => {
            const playerDiv = document.createElement('div');
            playerDiv.textContent = `${player.name} (${player.type}, Level: ${player.level})`;
            teamDiv.appendChild(playerDiv);
        });

        teamsContainer.appendChild(teamDiv);
    });
}

displayPlayers();
const savedTeams = JSON.parse(localStorage.getItem('teams'));
if (savedTeams) {
    displayTeams(savedTeams);
}

function navigateTo(page) {
    if (page === 'home') {
        window.location.href = '../index.html';
    }
}