"use client";

import { Button } from "@/components/ui/button";

const colors = ["white", "black", "red", "royalblue"];

export default function ColorPicker({ onChange }: { onChange: (c: string) => void }) {
  return (
    <div className="flex gap-2 justify-center mt-4">
      {colors.map(c => (
        <Button
          key={c}
          onClick={() => onChange(c)}
          style={{ backgroundColor: c, color: "white" }}
        >
          {c}
        </Button>
      ))}
    </div>
  );
}
