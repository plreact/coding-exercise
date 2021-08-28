const express = require('express');
const app = express();
const port = 3001;
const cors = require('cors');

app.use(cors());
app.options('*', cors());
app.use(express.json());

const TEST_USER = {
  username: 'testuser',
  password: 'password',
};

function login(postParams) {
  if (
    postParams &&
    postParams.username === TEST_USER.username &&
    postParams.password === TEST_USER.password
  ) {
    return {
      username: 'testuser',
      fullname: 'Test User',
    };
  }
  return null
}

app.post('/api/login', (req, res) => {
  const userDetails = login(req.body);
  if (userDetails) {
    res
      .status(200)
      .type('application/json')
      .send(userDetails);
  } else {
    res
      .status(401)
      .type('application/json')
      .send({
        status: 'error',
        message: 'incorrect username or password.'
      });
  }
})

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
});
