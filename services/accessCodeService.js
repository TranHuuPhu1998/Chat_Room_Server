import { db } from "../config/firebase.js";

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function createAccessCode(phoneNumber) {
  const code = generateCode();
  await db.collection("accessCodes").doc(phoneNumber).set({
    code,
    createdAt: Date.now(),
    expiresAt: Date.now() + 5 * 60 * 1000,
  });
  return code;
}

export async function verifyAccessCode(phoneNumber, code) {
  const doc = await db.collection("accessCodes").doc(phoneNumber).get();
  if (!doc.exists) return false;

  const data = doc.data();
  if (data.code !== code) return false;
  if (Date.now() > data.expiresAt) return false;

  return true;
}
