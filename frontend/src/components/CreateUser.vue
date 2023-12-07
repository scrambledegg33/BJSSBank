<template>
    <div class="create-account-container">
      <h2>Create Account</h2>
      <div class="form-group">
        <label for="username">Username: </label>
        <input type="text" id="username" v-model="username" />
      </div>
      <div class="form-group">
        <label for="password">Password: </label>
        <input type="password" id="password" v-model="password" />
      </div>
      <div class="form-group">
        <label for="fullName">Full Name: </label>
        <input type="text" id="fullName" v-model="fullName" />
      </div>
      <div class="form-group">
        <label for="email">Email: </label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      <div class="button-group">
        <button @click="createUser">Create User</button>
        <button @click="goToLoginPage">Back to Login</button>
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
        fullName: "",
        email: "",
        errorMessage: "",
      };
    },
    
    methods: {
      createUser() {
        const userData = {
        username: this.username,
        password: this.password,
        full_name: this.fullName,
        email: this.email
      };
      axios.post('http://localhost:8080/users', userData)
        .then(response => {
          if (response && response.data) {
          
          this.$router.push("/");
          }
        })
        .catch(error => {
          console.error("Create user error:", error.response.data);
          if (error.response && error.response.status === 400) {
            this.errorMessage = "Invalid email format";
          } else {
            this.errorMessage = "Error creating user";
          }
         
      
    })

        console.log("Create Account clicked!");
      },
      goToLoginPage() {
        this.$router.push("/");
        console.log("Going back to Login Page");
      },
    },
  };
  </script>
  
  <style>
  .create-account-container {
    max-width: 300px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
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
    justify-content: space-between;
    margin-top: 20px;
  }
  
  button {
    padding: 10px 20px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #0056b3;
  }

  .error-message {
  color: red;
  font-size: 12px; 
}
  </style>