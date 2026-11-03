import { describe, expect, it } from "vitest";
import { SEED_PRODUCTS, toDOP } from "@/lib/catalog";

describe("pricing", () => {
  it("converts USD to DOP with the editable rate", () => {
    expect(toDOP(100, 60)).toBe(6000);
    expect(toDOP(250, 58.5)).toBe(14625);
  });
  it("seed records carry no invented prices or verified status", () => {
    for (const p of SEED_PRODUCTS) {
      expect(p.priceUSD).toBeNull();
      expect(p.status).toBe("por-verificar");
    }
  });
  it("3018 class is distinguishable from 4040 class by work area", () => {
    const a = SEED_PRODUCTS.find((p) => p.id === "cnc-3018-clase")!;
    const b = SEED_PRODUCTS.find((p) => p.id === "router-4040-clase")!;
    expect([a.workArea.x, a.workArea.y]).toEqual([300, 180]);
    expect([b.workArea.x, b.workArea.y]).toEqual([400, 400]);
  });
});
