// Player management logic for Survivor Shuffle

// Drag-and-drop handlers
let dragSource = null;
let dragSourceIdx = null;

function onDragStart(event, source, idx) {
    dragSource = source;
    dragSourceIdx = idx;
    event.dataTransfer.effectAllowed = "move";
}

function onSwapDrop(event, targetList, targetIdx) {
    event.preventDefault();
    if (dragSource === null || dragSourceIdx === null) return;
    if (dragSource === targetList && dragSourceIdx === targetIdx) return;
    // Find source and target arrays
    let sourceArr, targetArr;
    if (dragSource === 'teamA') sourceArr = teamA;
    else if (dragSource === 'teamB') sourceArr = teamB;
    else if (dragSource === 'queue') sourceArr = queue.filter(p => !teamA.includes(p) && !teamB.includes(p));
    if (targetList === 'teamA') targetArr = teamA;
    else if (targetList === 'teamB') targetArr = teamB;
    else if (targetList === 'queue') targetArr = queue.filter(p => !teamA.includes(p) && !teamB.includes(p));
    // Get actual indices in queue if queueToShow is used
    let actualSourceArr = (dragSource === 'queue') ? queue : sourceArr;
    let actualTargetArr = (targetList === 'queue') ? queue : targetArr;
    let sourcePlayer = actualSourceArr[(dragSource === 'queue') ? queue.indexOf(sourceArr[dragSourceIdx]) : dragSourceIdx];
    let targetPlayer = actualTargetArr[(targetList === 'queue') ? queue.indexOf(targetArr[targetIdx]) : targetIdx];
    // Swap
    if (sourcePlayer && targetPlayer) {
        let sourceIdx = actualSourceArr.indexOf(sourcePlayer);
        let targetIdx2 = actualTargetArr.indexOf(targetPlayer);
        actualSourceArr[sourceIdx] = targetPlayer;
        actualTargetArr[targetIdx2] = sourcePlayer;
    }
    dragSource = null;
    dragSourceIdx = null;
    renderPlayers();
    renderTeams();
}


function adjustTeamsForTeamSize() {
    const teamSize = parseInt(document.getElementById('team_size').value, 10);
    // Treat all current team players as 'winners'
    const winners = [...teamA, ...teamB];
    // Remove all current team members from queue (by name)
    const namesToRemove = new Set(winners.map(p => p.name));
    queue = queue.filter(p => !namesToRemove.has(p.name));
    // Alternately assign winners to Team A and Team B
    teamA = [];
    teamB = [];
    for (let i = 0; i < winners.length; i++) {
        if (i % 2 === 0) {
            if (teamA.length < teamSize) teamA.push(winners[i]);
        } else {
            if (teamB.length < teamSize) teamB.push(winners[i]);
        }
    }
    // Fill teams with players from the front of the queue
    let idx = 0;
    while (teamA.length < teamSize && idx < queue.length) {
        if (!teamA.includes(queue[idx]) && !teamB.includes(queue[idx])) {
            teamA.push(queue[idx]);
        }
        idx++;
    }
    idx = 0;
    while (teamB.length < teamSize && idx < queue.length) {
        if (!teamA.includes(queue[idx]) && !teamB.includes(queue[idx])) {
            teamB.push(queue[idx]);
        }
        idx++;
    }
    renderPlayers();
    renderTeams();
}

function handleTeamWin(winningTeam) {
    const teamSize = parseInt(document.getElementById('team_size').value, 10);
    let winners, losers;
    if (winningTeam === 'A') {
        winners = [...teamA];
        losers = [...teamB];
        teamA.forEach(p => { p.wins++; p.streak++; });
        teamB.forEach(p => { p.losses++; p.streak = 0; });
    } else {
        winners = [...teamB];
        losers = [...teamA];
        teamB.forEach(p => { p.wins++; p.streak++; });
        teamA.forEach(p => { p.losses++; p.streak = 0; });
    }
    // Remove all current team members from queue (by name)
    const namesToRemove = new Set([...winners, ...losers].map(p => p.name));
    queue = queue.filter(p => !namesToRemove.has(p.name));
    // Add losers to bottom of queue
    queue.push(...losers);
    // Alternately assign winners to Team A and Team B
    teamA = [];
    teamB = [];
    for (let i = 0; i < winners.length; i++) {
        if (i % 2 === 0) {
            if (teamA.length < teamSize) teamA.push(winners[i]);
        } else {
            if (teamB.length < teamSize) teamB.push(winners[i]);
        }
    }
    // Fill teams with players from the front of the queue
    let idx = 0;
    while (teamA.length < teamSize && idx < queue.length) {
        if (!teamA.includes(queue[idx]) && !teamB.includes(queue[idx])) {
            teamA.push(queue[idx]);
        }
        idx++;
    }
    idx = 0;
    while (teamB.length < teamSize && idx < queue.length) {
        if (!teamA.includes(queue[idx]) && !teamB.includes(queue[idx])) {
            teamB.push(queue[idx]);
        }
        idx++;
    }
    renderPlayers();
    renderTeams();
}

const players = [];
let queue = [];
let teamA = [];
let teamB = [];

function renderPlayers() {
    const playersList = document.getElementById('players-list');
    playersList.innerHTML = '';
    if (players.length === 0) {
        playersList.innerHTML = '<li class="text-gray-400 text-center py-4">No players yet.</li>';
        return;
    }
    players.forEach((player, idx) => {
        playersList.innerHTML += `
            <li class="flex items-center justify-between py-2 border-b last:border-b-0">
                <span class="font-medium w-24">${player.name}</span>
                <div class="flex items-center gap-4 text-xs">
                    <div class="flex flex-col items-center">
                        <span class="font-semibold text-green-700">Wins</span>
                        <span class="font-bold">${player.wins}</span>
                    </div>
                    <div class="flex flex-col items-center">
                        <span class="font-semibold text-red-700">Losses</span>
                        <span class="font-bold">${player.losses}</span>
                    </div>
                    <div class="flex flex-col items-center">
                        <span class="font-semibold text-blue-700">Streak</span>
                        <span class="font-bold">${player.streak}</span>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <button class="px-3 py-1 rounded-full text-xs font-semibold focus:outline-none ${player.skip ? 'bg-yellow-200 text-yellow-800 hover:bg-yellow-300' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}" onclick="toggleSkip(${idx})">Skip</button>
                    <button class="px-2 py-1 rounded-full text-xs font-semibold bg-red-200 text-red-800 hover:bg-red-300 focus:outline-none" onclick="removePlayer(${idx})">✕</button>
                </div>
            </li>
        `;
    });
}

function addPlayer(name) {
    const teamSize = parseInt(document.getElementById('team_size').value, 10);
    const newPlayer = {
        name: name,
        wins: 0,
        losses: 0,
        streak: 0,
        skip: false
    };
    players.push(newPlayer);
    if (!newPlayer.skip) queue.push(newPlayer);
    // Alternate add to Team A then Team B, until both teams are full
    if (teamA.length < teamSize) {
        teamA.push(newPlayer);
    } else if (teamB.length < teamSize) {
        teamB.push(newPlayer);
    }

    renderPlayers();
    renderTeams();
}

function removePlayer(idx) {
    players.splice(idx, 1);
    renderPlayers();
    renderTeams();
}

function toggleSkip(idx) {
    players[idx].skip = !players[idx].skip;
    // Remove from queue if skipping
    if (players[idx].skip) {
        queue = queue.filter(p => p !== players[idx]);
        // Remove from teams and replace with next in queue
        [teamA, teamB].forEach(team => {
            let teamIdx = team.indexOf(players[idx]);
            if (teamIdx !== -1) {
                // Remove the skipping player
                team.splice(teamIdx, 1);
                // Find next available player from queue
                for (let i = 0; i < queue.length; i++) {
                    let candidate = queue[i];
                    if (!candidate.skip && !teamA.includes(candidate) && !teamB.includes(candidate)) {
                        team.splice(teamIdx, 0, candidate);
                        queue.splice(i, 1);
                        break;
                    }
                }
            }
        });
    } else {
        // Add to queue if not skipping and not already present and not in teams
        if (!queue.includes(players[idx]) && !teamA.includes(players[idx]) && !teamB.includes(players[idx])) {
            queue.push(players[idx]);
        }
    }
    renderPlayers();
    renderTeams();
}

function renderTeams() {
    const teamAList = document.getElementById('team-a-list');
    const teamBList = document.getElementById('team-b-list');
    const queueList = document.getElementById('next-up-list'); // repurpose for queue
    teamAList.innerHTML = '';
    teamBList.innerHTML = '';
    queueList.innerHTML = '';
    // --- Drag-and-drop rendering ---
    teamA.forEach((player, idx) => {
        teamAList.innerHTML += `<li class="py-1 text-blue-800" draggable="true" ondragstart="onDragStart(event, 'teamA', ${idx})" ondragover="event.preventDefault()" ondrop="onSwapDrop(event, 'teamA', ${idx})">${player.name}</li>`;
    });
    teamB.forEach((player, idx) => {
        teamBList.innerHTML += `<li class="py-1 text-blue-800" draggable="true" ondragstart="onDragStart(event, 'teamB', ${idx})" ondragover="event.preventDefault()" ondrop="onSwapDrop(event, 'teamB', ${idx})">${player.name}</li>`;
    });
    const queueToShow = queue.filter(p => !teamA.includes(p) && !teamB.includes(p));
    if (queueToShow.length === 0) {
        queueList.innerHTML = '<li class="text-gray-400 text-center py-4">None</li>';
    } else {
        queueToShow.forEach((player, idx) => {
            queueList.innerHTML += `<li class="py-1 text-blue-800" draggable="true" ondragstart="onDragStart(event, 'queue', ${idx})" ondragover="event.preventDefault()" ondrop="onSwapDrop(event, 'queue', ${idx})">${player.name}</li>`;
        });
    }
    // No list-level drop handlers for swapping

}


function startMatch() {
    // Get team size from dropdown
    const teamSize = parseInt(document.getElementById('team_size').value, 10);
    // Select first n*2 players who are not sitting
    const eligiblePlayers = players.filter(p => !p.sit).slice(0, teamSize * 2);
    teamA = eligiblePlayers.slice(0, teamSize);
    teamB = eligiblePlayers.slice(teamSize, teamSize * 2);
    renderTeams();
}

function resetAll() {
    if (!confirm('Are you sure you want to clear all players and teams?')) return;
    players.length = 0;
    queue.length = 0;
    teamA.length = 0;
    teamB.length = 0;
    renderPlayers();
    renderTeams();
}

document.addEventListener('DOMContentLoaded', function() {
    // Help modal logic
    const helpBtn = document.getElementById('help-btn');
    const helpModal = document.getElementById('help-modal');
    const closeHelpModal = document.getElementById('close-help-modal');
    if (helpBtn && helpModal && closeHelpModal) {
        helpBtn.addEventListener('click', () => {
            helpModal.classList.remove('hidden');
        });
        closeHelpModal.addEventListener('click', () => {
            helpModal.classList.add('hidden');
        });
        helpModal.addEventListener('click', (e) => {
            if (e.target === helpModal) helpModal.classList.add('hidden');
        });
        document.addEventListener('keydown', (e) => {
            if (!helpModal.classList.contains('hidden') && e.key === 'Escape') {
                helpModal.classList.add('hidden');
            }
        });
    }

    document.getElementById('team_size').addEventListener('change', adjustTeamsForTeamSize);

    document.getElementById('team-a-wins-btn').addEventListener('click', function() { handleTeamWin('A'); });
    document.getElementById('team-b-wins-btn').addEventListener('click', function() { handleTeamWin('B'); });
    // DEVELOPMENT: Populate 8 test players if players array is empty
    // No dummy data. Players are only added by user input.
    // Populate queue with all players not skipping
    queue = players.filter(p => !p.skip);

    const form = document.getElementById('add-player-form');
    const input = document.getElementById('player-name-input');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = input.value.trim();
        if (name.length > 0) {
            addPlayer(name);
            input.value = '';
            input.focus();
        }
    });
    renderPlayers();
    renderTeams();
});
