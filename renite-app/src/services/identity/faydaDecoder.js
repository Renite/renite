import { decodePayload } from "fayda-decoder";
import { verifySignature } from "fayda-decoder/verify";

/**
 * Decode a Fayda QR payload.
 *
 * This function only parses the payload.
 * A successful decode MUST NOT be treated as identity verification.
 */
export function decodeFaydaPayload(qrText) {
  if (typeof qrText !== "string" || !qrText.trim()) {
    return {
      ok: false,
      error: {
        code: "INVALID_INPUT",
        message: "A Fayda QR payload is required.",
      },
    };
  }

  return decodePayload(qrText.trim());
}

/**
 * Verify the cryptographic signature contained in a decoded Fayda payload.
 *
 * This is deliberately separate from decoding.
 */
export async function verifyFaydaSignature(decodedResult) {
  if (!decodedResult?.ok) {
    return {
      verified: false,
      reason: "INVALID_DECODE_RESULT",
    };
  }

  const result = await verifySignature(decodedResult);

  return {
    verified: result.verified === true,
    reason: result.verified ? null : result.reason || "SIGNATURE_INVALID",
  };
}

/**
 * Decode and verify a Fayda QR payload.
 *
 * Returns both the decoded data and explicit authenticity state.
 */
export async function decodeAndVerifyFayda(qrText) {
  const decoded = decodeFaydaPayload(qrText);

  if (!decoded.ok) {
    return {
      ok: false,
      decoded,
      verification: {
        verified: false,
        reason: "DECODE_FAILED",
      },
    };
  }

  const verification = await verifyFaydaSignature(decoded);

  return {
    ok: verification.verified,
    decoded,
    verification,
  };
}
