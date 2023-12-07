<template>
  <div class="create-account-container">
    <button class="logout-button" @click="logout">Logout</button>
    <h2>Create Account</h2>
    <div class="form-group">
      <label for="currency">Select Currency:</label>
      <select v-model="selectedCurrency" id="currency">
        <option disabled value="">Select Currency</option>
        <option value="GBP">GBP</option>
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
      </select>
    </div>
    <div class="button-group">
      <button @click="createAccount">Create Account</button>
    </div>
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
    <div class="form-group">
      <label for="existingAccount">Select Existing Account:</label>
      <select v-model="selectedAccountId" id="existingAccount">
        <option disabled value="">Select Account</option>
        <option v-for="account in userAccounts" :key="account.id" :value="account.id">
          {{ account.currency }}
        </option>
      </select>
    </div>
    <div class="button-group">
      <button @click="continueToExistingAccount" v-if="selectedAccountId">Continue to Existing Account</button>
    </div>
  </div>
</template>
  
<script>
import axios from 'axios';
export default {
  data() {
    return {
      selectedCurrency: "",
      selectedAccountId: null,
      userAccounts: [],
      selectedAccountInfo: null,
      errorMessage: "",
    };
  },
  created() {
    this.fetchUserAccounts();
  },
  methods: {
    fetchUserAccounts() {

      const accessToken = localStorage.getItem('access_token');

      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      axios.get('http://localhost:8080/accounts?page_id=1&page_size=5', config)
        .then(response => {

          this.userAccounts = response.data
        })
        .catch(error => {

          console.error("Error fetching user accounts:", error);
        });
    },
    createAccount() {
      const accessToken = localStorage.getItem('access_token');

      const accountData = {
        currency: this.selectedCurrency,
      };

      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const hasDuplicateAccount = this.userAccounts.some(account => account.currency === this.selectedCurrency);

      if (hasDuplicateAccount) {

        this.errorMessage = `You already have an account in ${this.selectedCurrency}.`;
        return;
      }

      axios.post('http://localhost:8080/accounts', accountData, config)
        .then(response => {

          if (response && response.data) {

            const accountInfo = response.data;
            localStorage.setItem("accountInfo", JSON.stringify(accountInfo));
            this.$router.push({
              path: "/account-info",
              query: { accountInfo: JSON.stringify(accountInfo) },
            });
          }
        })
        .catch(error => {

          console.error("error:", error.response.data);

        })

    },
    continueToExistingAccount() {
      if (!this.selectedAccountId) {
        return;
      }


      const accessToken = localStorage.getItem('access_token');
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      axios.get(`http://localhost:8080/accounts/${this.selectedAccountId}`, config)
        .then(response => {
          const accountId = parseInt(this.selectedAccountId, 10);
          localStorage.setItem("accountId", accountId);
          this.$router.push({
            path: `/account-info`,
            query: { accountInfo: JSON.stringify(response.data) },
          });
        })
        .catch(error => {
          console.error("Error fetching account details:", error);
        });
    },
    logout() {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      localStorage.removeItem('accountInfo')
      this.$router.push('/');
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
  border: 1px solid rgba(4, 30, 66, 0.1);
  background-color: rgba(4, 30, 66, 1.0);
  color: white;
  font-family: Catamaran, Helvetica, sans-serif;
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
  text-align: center;
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

select {
  width: 100%;
  padding: 5px;
}

.logout-button {
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 8px 16px;
  background-color: green;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.logout-button:hover {
  background-color: #c82333;
}

.error-message {
  margin-top: 10px;
  padding: 10px;
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
}
</style>