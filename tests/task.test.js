const request = require('supertest');
const app = require('../index');
const errorMiddleware = require('../middlewares/errorMiddleware'); 


describe('Task API', () => {
  let token;

  beforeAll(async () => {
    // Connectez-vous et obtenez un token valide pour les tests
    const response = await request(app)
      .post('/login')
      .send({ username: '', password: '' });
    token = response.body.token;
  }, 10000);

  it('should create a new task', async () => {
    const response = await request(app)
      .post('/tasks')
      .set('Authorization', token)
      .send({ title: 'Task 1', description: 'Description of Task 1' });

    expect(response.status).toBe(201);
    expect(response.body.title).toBe('Task 1');
    expect(response.body.description).toBe('Description of Task 1');
  });

  it('should get all tasks', async () => {
    const response = await request(app)
      .get('/tasks')
      .set('Authorization', token);

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should get a task by ID', async () => {
    const createdTask = await request(app)
      .post('/tasks')
      .set('Authorization', token)
      .send({ title: 'Task 2', description: 'Description of Task 2' });

    const taskId = createdTask.body._id;
    const response = await request(app)
      .get(`/tasks/${taskId}`)
      .set('Authorization', token);

    expect(response.status).toBe(200);
    expect(response.body.title).toBe('Task 2');
    expect(response.body.description).toBe('Description of Task 2');
  });

  it('should update a task', async () => {
    const createdTask = await request(app)
      .post('/tasks')
      .set('Authorization', token)
      .send({ title: 'Task 3', description: 'Description of Task 3' });

    const taskId = createdTask.body._id;
    const response = await request(app)
      .put(`/tasks/${taskId}`)
      .set('Authorization', token)
      .send({ title: 'Task 3 Updated' });

    expect(response.status).toBe(200);
    expect(response.body.title).toBe('Task 3 Updated');
  });

  it('should delete a task', async () => {
    const createdTask = await request(app)
      .post('/tasks')
      .set('Authorization', token)
      .send({ title: 'Task 4', description: 'Description of Task 4' });

    const taskId = createdTask.body._id;
    const response = await request(app)
      .delete(`/tasks/${taskId}`)
      .set('Authorization', token);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Task deleted successfully');
  });
});
