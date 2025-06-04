// Add dummy players for testing
var debug = false;

document.addEventListener('DOMContentLoaded', function() {
  const helpBtn = document.getElementById('help-btn');
  const helpModal = document.getElementById('help-modal');
  const closeHelpModal = document.getElementById('close-help-modal');

  if (helpBtn && helpModal) {
    helpBtn.addEventListener('click', function() {
      helpModal.classList.remove('hidden');
    });
  }
  if (closeHelpModal && helpModal) {
    closeHelpModal.addEventListener('click', function() {
      helpModal.classList.add('hidden');
    });
  }
  // Optional: Close modal when clicking outside modal content
  if (helpModal) {
    helpModal.addEventListener('click', function(e) {
      if (e.target === helpModal) {
        helpModal.classList.add('hidden');
      }
    });
  }
});

let players = [];
let queue = [];
let teamA = [];
let teamB = [];
let teamSize = 2;
let maxStreak = 0;

function startRound() {
    // Find the number of open slots in teamA and teamB
    let openSlots = teamSize*2 - teamA.length - teamB.length;

    if (openSlots > 0) {
        alert('You must assign players to teams to start a round.')
        return;
    }
    document.getElementById('start-round-btn').classList.add('hidden');
    document.getElementById('team-a-wins-btn').classList.remove('hidden');
    document.getElementById('team-b-wins-btn').classList.remove('hidden');
    renderTeams();
    renderQueue();
}

function updateTeamSize() {
    teamSize = document.getElementById('team_size').value;
    renderTeams();
}

function resetAll() {
    if (!confirm('Are you sure you want to clear all players and teams?')) return;
    players.length = 0;
    queue.length = 0;
    teamA.length = 0;
    teamB.length = 0;
    document.getElementById('start-round-btn').classList.remove('hidden');
    document.getElementById('end-round-btn').classList.add('hidden');
    renderAll();
}

function addPlayer(name) {
    const newPlayer = {
        id: players.length === 0 ? 1 : Math.max(...players.map(p => p.id)) + 1,
        name: name,
        wins: 0,
        losses: 0,
        streak: 0,
        skip: false,
    };
    players.push(newPlayer);
    queue.push(newPlayer);
    renderPlayers();
    renderQueue();
}

function removePlayer(id) {
    console.log(id);
    players = players.filter(player => player.id !== id);
    queue = queue.filter(player => player.id !== id);
    teamA = teamA.filter(player => player.id !== id);
    teamB = teamB.filter(player => player.id !== id);
    renderPlayers();
    renderQueue();
    renderTeams();
}
function swapPlayers(arr1, index1, arr2, index2) {
    const player1 = arr1[index1];
    if (arr2[index2] === undefined) {
        arr2.push(player1);
        arr1.splice(index1, 1);
    } else {
        const player2 = arr2[index2];
        arr2[index2] = player1;
        arr1[index1] = player2;
    }
    renderPlayers();
    renderQueue();
    renderTeams();
}

function renderPlayers() {
    const playersList = document.getElementById('players-list');
    playersList.innerHTML = '';
    if (players.length === 0) {
        playersList.innerHTML = '<div class="text-gray-400 text-center py-4">Add players.</div>';
    } else {
        // Table sorting state
        if (!window.playerTableSort) {
          window.playerTableSort = { key: 'name', asc: true };
        }
        const sortKeys = ['name', 'wins', 'losses', 'streak'];
        function sortPlayers(arr, key, asc) {
          return arr.slice().sort((a, b) => {
            if (key === 'name') {
              return asc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
            } else {
              return asc ? a[key] - b[key] : b[key] - a[key];
            }
          });
        }
        let sortedPlayers = sortPlayers(players, window.playerTableSort.key, window.playerTableSort.asc);
        let tableHTML = `<table class="min-w-full text-sm text-left">
          <thead>
            <tr>
              <th class="px-3 py-2 cursor-pointer" onclick="window.playerTableSort.key='name';window.playerTableSort.asc=window.playerTableSort.key==='name'? !window.playerTableSort.asc : true;renderPlayers();">Name</th>
              <th class="px-3 py-2 text-center cursor-pointer" onclick="window.playerTableSort.key='wins';window.playerTableSort.asc=window.playerTableSort.key==='wins'? !window.playerTableSort.asc : true;renderPlayers();">Wins</th>
              <th class="px-3 py-2 text-center cursor-pointer" onclick="window.playerTableSort.key='losses';window.playerTableSort.asc=window.playerTableSort.key==='losses'? !window.playerTableSort.asc : true;renderPlayers();">Losses</th>
              <th class="px-3 py-2 text-center cursor-pointer" onclick="window.playerTableSort.key='streak';window.playerTableSort.asc=window.playerTableSort.key==='streak'? !window.playerTableSort.asc : true;renderPlayers();">Streak</th>
              <th class="px-3 py-2 text-center">Controls</th>
            </tr>
          </thead>
          <tbody>`;
        sortedPlayers.forEach((player, idx) => {
          tableHTML += `
            <tr data-player-id="${player.id}" style="background: ${idx % 2 === 0 ? 'var(--ctp-base)' : 'var(--ctp-surface1)'};">
              <td class="px-3 py-2 font-medium">${player.name}</td>
              <td class="px-3 py-2 text-center" style="color: var(--ctp-green); font-weight: bold;">${player.wins}</td>
              <td class="px-3 py-2 text-center" style="color: var(--ctp-red); font-weight: bold;">${player.losses}</td>
              <td class="px-3 py-2 text-center" style="color: var(--ctp-yellow); font-weight: bold;">${player.streak}</td>
              <td class="px-3 py-2 text-center">
                <button class="mr-2 focus:outline-none skip-btn" onclick="toggleSkip(${player.id})" title="Skip player" aria-label="Skip player" style="background:none;border:none;padding:0;cursor:pointer;">
                  <span class="material-icons ${player.skip ? 'text-yellow-700' : 'text-text'} transition-colors" style="font-size:1.8em; vertical-align:middle;">skip_next</span>
                </button>
                <button class="focus:outline-none delete-btn" onclick="removePlayer(${player.id})" title="Delete player" aria-label="Delete player" style="background:none;border:none;padding:0;cursor:pointer;">
                  <span class="material-icons text-text transition-colors" style="font-size:1.5em; vertical-align:middle;">delete</span>
                </button>
              </td>
            </tr>
          `;
        });
        tableHTML += '</tbody></table>';
        playersList.innerHTML = tableHTML;
    }
}

function renderQueue() {
    const queueList = document.getElementById('queue-list');
    queueList.innerHTML = '';
    if (queue.length === 0) {
        queueList.innerHTML = '<li class="text-gray-400 text-center py-4">Add players.</li>';
    } else {
        queue.forEach((player) => {
            if (player.skip) {
                return;
            }
            const li = document.createElement('li');
            li.classList.add('ctp-li', 'queue-li');
            li.setAttribute('draggable', 'true');
            li.setAttribute('ondragstart', 'handleOnDrag(event)')
            li.setAttribute('data-player-id', player.id);
            li.setAttribute('data-array', 'queue');
            li.textContent = player.name;
            li.addEventListener('dragstart', () => {
                li.classList.add('ctp-li-dragging');
            });
            li.addEventListener('dragend', () => {
                li.classList.remove('ctp-li-dragging');
            });
            queueList.appendChild(li);
        });
    }
}

function renderTeams() {
    const teamAList = document.getElementById('team-a-list');
    const teamBList = document.getElementById('team-b-list');
    teamAList.innerHTML = '';
    teamBList.innerHTML = '';
    teamA.forEach((player) => {
        const li = document.createElement('li');
        li.classList.add('ctp-li', 'queue-li');
        li.setAttribute('draggable', 'true');
        li.setAttribute('ondragstart', 'handleOnDrag(event)')
        li.setAttribute('data-player-id', player.id);
        li.setAttribute('data-array', 'teamA');
        li.textContent = player.name;
        li.addEventListener('dragstart', () => {
            li.classList.add('ctp-li-dragging');
        });
        li.addEventListener('dragend', () => {
            li.classList.remove('ctp-li-dragging');
        });
        teamAList.appendChild(li);
    });
    if (teamA.length < teamSize) {
        for (let i = teamA.length; i < teamSize; i++) {
            const li = document.createElement('li');
            li.classList.add('drag-placeholder');
            li.setAttribute('data-player-id', null);
            li.setAttribute('data-array', 'teamA');
            li.textContent = 'Open';
            teamAList.appendChild(li);
        }
    }
    teamB.forEach((player) => {
        const li = document.createElement('li');
        li.classList.add('ctp-li', 'queue-li');
        li.setAttribute('draggable', 'true');
        li.setAttribute('ondragstart', 'handleOnDrag(event)')
        li.setAttribute('data-player-id', player.id);
        li.setAttribute('data-array', 'teamB');
        li.textContent = player.name;
        li.addEventListener('dragstart', () => {
            li.classList.add('ctp-li-dragging');
        });
        li.addEventListener('dragend', () => {
            li.classList.remove('ctp-li-dragging');
        });
        teamBList.appendChild(li);
    });
    if (teamB.length < teamSize) {
        for (let i = teamB.length; i < teamSize; i++) {
            const li = document.createElement('li');
            li.classList.add('drag-placeholder');
            li.setAttribute('data-player-id', null);
            li.setAttribute('data-array', 'teamB');
            li.textContent = 'Open';
            teamBList.appendChild(li);
        }
    }
}

function renderAll() {
    renderPlayers();
    renderTeams();
    renderQueue();
}

function allowDrop(e) {
    // Only allow drop on <li> elements
    if (e.target.tagName.toLowerCase() === 'li') {
        e.preventDefault();
        e.target.classList.add('ctp-li-drop');
    }
}

document.addEventListener('dragleave', function(e) {
    if (e.target.tagName && e.target.tagName.toLowerCase() === 'li') {
        e.target.classList.remove('ctp-li-drop');
    }
}, true);

function handleOnDrag(e) {
    e.target.classList.add('ctp-li-dragging');
    const parent = e.target.parentElement;
    const children = Array.from(parent.children);
    const index = children.indexOf(e.target);
    const payload = JSON.stringify({
        arrayName: e.target.dataset.array,
        index: index
    });
    e.dataTransfer.setData('application/json', payload);
}

function handleOnDrop(e) {
    e.preventDefault();
    const payload = JSON.parse(e.dataTransfer.getData('application/json'));
    const targetArrayName = e.target.dataset.array;
    const arrayMap = { teamA, teamB, queue };
    const sourceArrayName = payload.arrayName;
    const sourceArray = arrayMap[sourceArrayName];
    const targetArray = arrayMap[targetArrayName];
    const parent = e.target.parentElement;
    const children = Array.from(parent.children);
    const targetIndex = children.indexOf(e.target);
    const sourceIndex = payload.index;
    swapPlayers(sourceArray, sourceIndex, targetArray, targetIndex);
}

function handleTeamWin(teamName) {
    const [winningTeam, losingTeam] = teamName === 'teamA' ? [teamA, teamB] : [teamB, teamA];
    if (winningTeam.length < teamSize || losingTeam.length < teamSize) {
        alert('You must assign players to teams to start a round.')
        return;
    }
    losingTeam.forEach(player => {
        player.losses++;
        player.streak = 0;
    });
    queue.push(...losingTeam);
    losingTeam.length = 0;
    const winningPlayers = [];
    winningTeam.forEach((player, i) => {
        player.wins++;
        player.streak++;
        winningPlayers.push(player);
    });
    teamA.length = 0;
    teamB.length = 0;
    winningPlayers.forEach((player, i) => {
        // alternate winning players to different teams
        if (i % 2 === 0) {
            teamA.push(player);
        } else {
            teamB.push(player);
        }
    });
    winningPlayers.length = 0;
    // While either teamA or teamB has less than teamSize players, move players from queue to fill the gap
    while (teamA.length < teamSize || teamB.length < teamSize) {
        const player = queue.shift();
        if (teamA.length < teamB.length) {
            teamA.push(player);
        } else {
            teamB.push(player);
        }
    }
    renderAll();
}

function toggleSkip(playerId) {
    const player = players.find(p => p.id === playerId);
    player.skip = !player.skip;
    // Remove player from queue or teams when toggling skip on
    if (player.skip) {
        queue = queue.filter(p => p.id !== playerId);
        teamA = teamA.filter(p => p.id !== playerId);
        teamB = teamB.filter(p => p.id !== playerId);
    }
    // Add player back to the top of the queue when toggling skip off
    if (!player.skip && !queue.includes(player)) {
        queue.unshift(player);
    }
    renderAll();
}

document.addEventListener('DOMContentLoaded', function() {
    // Add dummy players when debugging
    if (debug) {
        addPlayer("Player 1");
        addPlayer("Player 2");
        addPlayer("Player 3");
        addPlayer("Player 4");
        addPlayer("Player 5");
        addPlayer("Player 6");
        addPlayer("Player 7");
        addPlayer("Player 8");
    }

    document.getElementById('start-round-btn').addEventListener('click', function() { startRound(); });
    document.getElementById('team-a-wins-btn').addEventListener('click', function() { handleTeamWin('teamA'); });
    document.getElementById('team-b-wins-btn').addEventListener('click', function() { handleTeamWin('teamB'); });
    // Event listener for changing team size
    document.getElementById('team_size').addEventListener('change', function() {
        updateTeamSize();
    });
    // Event listener for changing max streak
    document.getElementById('max-streak-input').addEventListener('change', function() {
        maxStreak = parseInt(this.value);
    });

    document.addEventListener('dragend', function(e) {
        if (e.target.tagName && e.target.tagName.toLowerCase() === 'li') {
            e.target.classList.remove('ctp-li-dragging');
        }
    }, true);

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
    updateTeamSize();
    renderAll();
});
