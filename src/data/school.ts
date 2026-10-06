import { building } from './buildings';
import type { School } from '../types/school';

export function getSchool(): School {
  return {
    id: 'al-falah',
    name: 'Al-Falah School',
    buildings: [building],
  };
}

export const school: School = getSchool();
