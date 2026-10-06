export type FurnitureKind = 'classroom' | 'library' | 'lab' | 'office';

type P = {
  position: [number, number, number];
  opacity?: number;
};

function mat(color: string, opacity: number) {
  return <meshStandardMaterial color={color} transparent={opacity < 1} opacity={opacity} />;
}

function TeacherDesk({ position, opacity = 1 }: P) {
  return (
    <mesh position={position}>
      <boxGeometry args={[1.6, 0.75, 0.8]} />
      {mat('#a9713f', opacity)}
    </mesh>
  );
}

function StudentDesk({ position, opacity = 1 }: P) {
  return (
    <group position={position}>
      <mesh position={[0, 0.55, 0]}>
        <boxGeometry args={[0.9, 0.08, 0.6]} />
        {mat('#c9a06a', opacity)}
      </mesh>
      <mesh position={[-0.35, 0.25, 0]}>
        <boxGeometry args={[0.08, 0.5, 0.5]} />
        {mat('#8a8f96', opacity)}
      </mesh>
      <mesh position={[0.35, 0.25, 0]}>
        <boxGeometry args={[0.08, 0.5, 0.5]} />
        {mat('#8a8f96', opacity)}
      </mesh>
      <mesh position={[0, 0.45, 0.65]}>
        <boxGeometry args={[0.5, 0.5, 0.08]} />
        {mat('#7d848d', opacity)}
      </mesh>
    </group>
  );
}

function Board({ position, width, opacity = 1 }: P & { width: number }) {
  return (
    <mesh position={position}>
      <boxGeometry args={[Math.min(width * 0.5, 4), 1.2, 0.06]} />
      {mat('#2f5d3a', opacity)}
    </mesh>
  );
}

function Shelf({ position, opacity = 1 }: P) {
  return (
    <mesh position={position}>
      <boxGeometry args={[2.2, 1.8, 0.5]} />
      {mat('#7a5a36', opacity)}
    </mesh>
  );
}

function Bench({ position, opacity = 1 }: P) {
  return (
    <mesh position={position}>
      <boxGeometry args={[2.4, 0.8, 1.0]} />
      {mat('#dfe6ee', opacity)}
    </mesh>
  );
}

/** Simplified furniture set; each piece <12 boxes. Placed relative to room center. */
export default function Furniture({
  kind,
  width,
  depth,
  opacity = 1,
}: {
  kind: FurnitureKind;
  width: number;
  depth: number;
  opacity?: number;
}) {
  if (kind === 'library') {
    return (
      <group>
        <Shelf position={[-width / 4, 0.9, -depth / 4]} opacity={opacity} />
        <Shelf position={[width / 4, 0.9, -depth / 4]} opacity={opacity} />
        <TeacherDesk position={[0, 0.375, depth / 4]} opacity={opacity} />
        <StudentDesk position={[-1.2, 0, depth / 4 + 1.2]} opacity={opacity} />
        <StudentDesk position={[1.2, 0, depth / 4 + 1.2]} opacity={opacity} />
      </group>
    );
  }
  if (kind === 'lab') {
    return (
      <group>
        <Bench position={[-width / 4, 0.4, 0]} opacity={opacity} />
        <Bench position={[width / 4, 0.4, 0]} opacity={opacity} />
        <Bench position={[-width / 4, 0.4, depth / 4]} opacity={opacity} />
        <Bench position={[width / 4, 0.4, depth / 4]} opacity={opacity} />
        <Board position={[0, 1.8, -depth / 2 + 0.2]} width={width} opacity={opacity} />
      </group>
    );
  }
  if (kind === 'office') {
    return (
      <group>
        <TeacherDesk position={[-1, 0.375, 0]} opacity={opacity} />
        <TeacherDesk position={[1.5, 0.375, 0.5]} opacity={opacity} />
        <Shelf position={[width / 2 - 1.3, 0.9, -depth / 2 + 0.5]} opacity={opacity} />
      </group>
    );
  }
  // classroom: teacher desk + board + 6 student desks grid
  return (
    <group>
      <TeacherDesk position={[0, 0.375, -depth / 2 + 1]} opacity={opacity} />
      <Board position={[0, 1.8, -depth / 2 + 0.2]} width={width} opacity={opacity} />
      {[-1, 1].map((cx) =>
        [-0.8, 0.6, 2.0].map((cz) => (
          <StudentDesk key={`${cx}${cz}`} position={[(cx * width) / 5, 0, cz]} opacity={opacity} />
        )),
      )}
    </group>
  );
}
