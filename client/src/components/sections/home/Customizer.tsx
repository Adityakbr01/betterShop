"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";

const Scene = dynamic(() => import("@/components/3d/Scene"), { ssr: false });

const colors = ["white", "black", "red", "royalblue"];

export default function Customizer() {
  const [color, setColor] = useState("white");

  return (
    <section className="py-16 px-4 text-center">
      <h2 className="text-2xl font-bold">Customize Your T-shirt</h2>
      <div className="w-full h-[60vh] mt-6">
        <Scene />
      </div>

      <div className="flex justify-center gap-4 mt-6">
        {colors.map((c) => (
          <Button
            key={c}
            onClick={() => setColor(c)}
            style={{ backgroundColor: c, color: "white" }}
          >
            {c}
          </Button>
        ))}
      </div>
    </section>
  );
}
