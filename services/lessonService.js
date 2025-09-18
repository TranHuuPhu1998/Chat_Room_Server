import { db } from "../config/firebase.js";

export async function assignLesson({ studentPhone, title, description }) {
  const snapshot = await db.collection("students").where("phone", "==", studentPhone).get();
  if (snapshot.empty) {
    throw new Error("Student not found");
  }

  const studentDoc = snapshot.docs[0].ref;

  const newLesson = {
    title,
    description,
    assignedAt: Date.now()
  };

  const lessonRef = await studentDoc.collection("lessons").add(newLesson);

  return { id: lessonRef.id, ...newLesson };
}
