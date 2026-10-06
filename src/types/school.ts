export type RoomType =
  | 'classroom'
  | 'laboratory'
  | 'library'
  | 'office'
  | 'toilet'
  | 'hall';

export type Room = {
  id: string;
  floorId: string;
  name: string;
  type: RoomType;
  position: [number, number, number];
  /** Y rotation (radians) of the room group; doors face local +Z. */
  rotationY?: number;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  capacity?: number;
};

export type Floor = {
  id: string;
  buildingId: string;
  level: number;
  name: string;
  rooms: Room[];
};

export type Building = {
  id: string;
  name: string;
  floors: Floor[];
};

export type School = {
  id: string;
  name: string;
  buildings: Building[];
};
