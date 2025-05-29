# Survivor Shuffle - Custom Match Tracker

Survivor Shuffle is a tool designed to help you organize teams, manage player rotations, and keep score for any multiplayer or group-based game where the winners continue to play and the losers are replaced by new players from a queue. It supports between 1 and 8 players per team.

## Features

- **Add/Remove Players:** Quickly add new players or remove them from the roster.
- **Team Management:** Automatically or manually assign players to Team A, Team B, or the Queue.
- **Queue System:** Players not in a team are placed in a queue for future matches.
- **Dynamic Team Size:** Change team sizes on the fly; teams rebalance automatically.
- **Skip Function:** Temporarily remove a player from teams and the queue with the "Skip" toggle.
- **Drag & Drop:** Swap players between teams and the queue using drag-and-drop.
- **Match Results:** Record match outcomes and track wins, losses, and streaks for each player.
- **Reset:** Clear all players and teams with a single click.
- **Responsive UI:** Clean, mobile-friendly interface styled with Tailwind CSS.
- **Help Modal:** Floating help button provides a summary of all features.

## Usage

1. Open `index.html` in your browser.
2. Add players using the form on the right.
3. Adjust team size, mark players as skip, drag-and-drop to swap, and record match results as needed.
4. Use the floating (?) button for a summary of features.

All data is stored in-memory and will reset when the page is closed or refreshed.

## Deployment

This is a pure static site. You can deploy it to GitHub Pages, Netlify, Vercel, or any static web host.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
