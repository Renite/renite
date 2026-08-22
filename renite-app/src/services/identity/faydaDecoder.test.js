import { describe, expect, it } from "vitest";
import { decodeFaydaPayload, decodeAndVerifyFayda } from "./faydaDecoder";

describe("Fayda decoder service", () => {
  it("rejects an empty payload", () => {
    const result = decodeFaydaPayload("");

    expect(result.ok).toBe(false);
    expect(result.error.code).toBe("INVALID_INPUT");
  });

  it("does not treat decoding as verification", async () => {
    const result = await decodeAndVerifyFayda("not-a-valid-fayda-payload");

    expect(result.ok).toBe(false);
    expect(result.verification.verified).toBe(false);
  });
});
