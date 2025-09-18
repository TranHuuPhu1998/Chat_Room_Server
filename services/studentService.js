import { db } from "../config/firebase.js";

export async function addStudent({ name, phone, email, address }) {
    const newStudent = {
        name,
        phone,
        email,
        address,
        createdAt: Date.now()
    };

    const docRef = await db.collection("students").add(newStudent);
    return { id: docRef.id, ...newStudent };
}

export async function getAllStudents() {
    const snapshot = await db.collection("students").get();
    const students = snapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name,
      phone: doc.data().phone,
      address: doc.data().address,
      email: doc.data().email
    }));
    return students;
}

export async function getStudentWithLessons(phone) {
    const snapshot = await db.collection("students").where("phone", "==", phone).get();
    if (snapshot.empty) {
      throw new Error("Student not found");
    }
  
    const studentDoc = snapshot.docs[0];
    const studentData = studentDoc.data();
  
    const lessonsSnap = await studentDoc.ref.collection("lessons").get();
    const lessons = lessonsSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  
    return {
      id: studentDoc.id,
      name: studentData.name,
      phone: studentData.phone,
      email: studentData.email,
      lessons
    };
  }
