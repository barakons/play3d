import SchoolScene from '../three/SchoolScene';
import { floors } from '../data/floors';
import Header from '../ui/Header';
import RoomPanel from '../ui/RoomPanel';
import Sidebar from '../ui/Sidebar';

export default function App() {
  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden">
      <Header />
      <div className="hidden bg-amber-100 px-4 py-1 text-center text-xs text-amber-800 min-[1280px]:hidden max-[1279px]:block">
        Best experienced at 1280×720 or larger.
      </div>
      <div className="flex min-h-0 flex-1">
        <Sidebar />
        <main className="relative min-w-0 flex-1">
          <SchoolScene floors={floors} />
          <RoomPanel />
        </main>
      </div>
    </div>
  );
}
