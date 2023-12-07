<template>
  
  <div class="login-container">
    <h1 class="title">Bank of BJSS</h1>
    <h2>Login</h2>
    <div class="form-group">
      <label for="username">Username: </label>
      <input type="text" id="username" v-model="username" />
    </div>
    <div class="form-group">
      <label for="password">Password: </label>
      <input type="password" id="password" v-model="password" />
    </div>
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
    <div class="button-group">
      <button @click="login">Login</button>
      <button @click="createUser">Create User</button>
    </div>
  </div>

</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      username: "",
      password: "",
      errorMessage: "",
    };
  },
  methods: {
    login() {
      const loginData = {
        username: this.username,
        password: this.password,
      };
      axios.post('http://localhost:8080/users/login', loginData)
        .then(response => {
          if (response && response.data) {
          const { access_token, user } = response.data;
          localStorage.setItem('access_token', access_token);
          localStorage.setItem('user', JSON.stringify(user));
          const userId = response.data.id;
          localStorage.setItem("userId",  parseInt(userId, 10));
          this.$router.push("/create-account");
          }
        })
        .catch(error => {
          console.error("Login error:", error.response.data);
          this.errorMessage = "Invalid username or password";
    })
  },
    createUser() {
      this.$router.push("/create-user");
      console.log("Create Account clicked!");
    },
},
}
</script>

<style>

.login-container {
  max-width: 300px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid rgba(4, 30, 66, 0.1); 
  background-color: rgba(4, 30, 66, 1.0); 
  text-align: center; 
  color: white;
  font-family: Catamaran,Helvetica,sans-serif;
}

.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px; 
}

.form-group {
  margin-bottom: 10px;
}

.label {
  display: block;
  font-weight: bold;
}

.input {
  width: 100%;
  padding: 5px;
}

.button-group {
  display: flex;
  flex-direction: column; 
  align-items: center; 
}

.button-group button {
  margin-bottom: 10px; 
}

.error-message {
  color: red;
  margin-top: 10px;
}
</style>

