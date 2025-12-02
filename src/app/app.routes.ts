import { Routes } from '@angular/router';
import { Homepage } from './pages/homepage/homepage';
import { Playgroundpage } from './pages/playgroundpage/playgroundpage';
import { Leaderboardpage } from './pages/leaderboardpage/leaderboardpage';

export const routes: Routes = [
    { path: '', component: Homepage },
    { path: 'playground', component: Playgroundpage },
    { path: 'leaderboard', component: Leaderboardpage },
];
