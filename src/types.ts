export type MatchStatus = 'upcoming' | 'live' | 'finished';

export interface UserProfile {
  uid: string;
  displayName: string;
  photoURL?: string;
  favoriteTeam?: string;
  bio?: string;
}

export interface Match {
  id: string;
  team1: string;
  team2: string;
  venue: string;
  status: MatchStatus;
  score1?: string;
  score2?: string;
  overs1?: string;
  overs2?: string;
  wickets1?: number;
  wickets2?: number;
  timestamp: string;
  aiSummary?: string;
}

export interface Comment {
  id: string;
  matchId: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  text: string;
  team?: string;
  timestamp: any;
}

export interface Reaction {
  id: string;
  matchId: string;
  userId: string;
  type: 'SIX' | 'FOUR' | 'OUT' | 'WICKET' | 'CHEER' | 'OOPS';
  team?: string;
  timestamp: any;
}

export const IPL_TEAMS = [
  { id: 'CSK', name: 'Chennai Super Kings', color: '#F7D708', logo: '🦁' },
  { id: 'MI', name: 'Mumbai Indians', color: '#004BA0', logo: '🌪️' },
  { id: 'RCB', name: 'Royal Challengers Bengaluru', color: '#D11D26', logo: '🐅' },
  { id: 'KKR', name: 'Kolkata Knight Riders', color: '#3A225D', logo: '⚔️' },
  { id: 'DC', name: 'Delhi Capitals', color: '#000080', logo: '🐅' },
  { id: 'SRH', name: 'Sunrisers Hyderabad', color: '#FF822A', logo: '🦅' },
  { id: 'RR', name: 'Rajasthan Royals', color: '#EA1A85', logo: '👑' },
  { id: 'PBKS', name: 'Punjab Kings', color: '#ED1B24', logo: '🦁' },
  { id: 'LSG', name: 'Lucknow Super Giants', color: '#3141E5', logo: '🏰' },
  { id: 'GT', name: 'Gujarat Titans', color: '#1B2133', logo: '🌩️' },
];
