import { addStudent, getAllStudents, deleteStudent, updateStudent } from './studentService.js';

class SocketService {
  constructor(io) {
    this.io = io;
  }

  // Handle new socket connection
  handleConnection(socket) {
    console.log('User connected:', socket.id);

    // Handle update student event from client
    socket.on('update-student', async (data) => {
      const { id , newData } = data;
      await updateStudent(id, newData);
      this.io.emit('student-updated', { id, newData });
    })

    // Handle delete student event from client
    socket.on('delete-student', async (data) => {
      const { id } = data;
      await deleteStudent(id);
      this.io.emit('student-deleted', { id });
    });

    // Handle send list of students event from client
    socket.on('get-list-of-students', async () => {
      const students = await getAllStudents();
      socket.emit('send-list-of-students', { students });
    });

    // Handle add student event from client
    socket.on('add-student', async (data) => {
      try {
        const { name, phone, email, address } = data;
        if (!name || !phone || !email) {
          socket.emit('error', { message: 'Missing parameters' });
          return;
        }

        const student = await addStudent({ name, phone, email ,address});
        
        // Emit success to all clients
        this.io.emit('student-added', { student });
      } catch (error) {
        console.error('Error adding student:', error);
        socket.emit('error', { message: 'Internal server error' });
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  }

}

export default SocketService;
