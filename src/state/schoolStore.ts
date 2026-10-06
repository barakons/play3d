import { create } from 'zustand';
import { DEFAULT_CAM_TARGET } from '../data/layout';

export type SchoolState = {
  selectedRoomId: string | null;
  selectedFloor: number;
  xrayMode: boolean;
  showRoomLabels: boolean;
  focusTarget: [number, number, number] | null;

  selectRoom: (id: string) => void;
  clearSelection: () => void;
  selectFloor: (floor: number) => void;
  setXrayMode: (enabled: boolean) => void;
  setShowRoomLabels: (enabled: boolean) => void;
  setFocusTarget: (target: [number, number, number] | null) => void;
  resetView: () => void;
};

export const useSchoolStore = create<SchoolState>((set) => ({
  selectedRoomId: null,
  selectedFloor: 1,
  xrayMode: false,
  showRoomLabels: true,
  focusTarget: null,

  selectRoom: (id) => set({ selectedRoomId: id }),
  clearSelection: () => set({ selectedRoomId: null }),
  selectFloor: (floor) => set({ selectedFloor: floor }),
  setXrayMode: (enabled) => set({ xrayMode: enabled }),
  setShowRoomLabels: (enabled) => set({ showRoomLabels: enabled }),
  setFocusTarget: (target) => set({ focusTarget: target }),
  resetView: () => set({ selectedRoomId: null, focusTarget: DEFAULT_CAM_TARGET }),
}));
