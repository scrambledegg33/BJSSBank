<template>
  <div class="account-container">
    <button class="logout-button" @click="logout">Logout</button>
    <h2>Account Information</h2>
    <div class="form-group">
      <label for="accountId">Account ID: </label>
      <input type="text" id="accountId" v-model="accountInfo.id" class="white" disabled />
    </div>
    <div class="form-group">
      <label for="accountName">Account Owner: </label>
      <input type="text" id="accountName" v-model="accountInfo.owner" class="white" disabled />
    </div>
    <div class="form-group">
      <label for="balance">Balance: </label>
      <input type="text" id="balance" v-model="accountInfo.balance" class="white" disabled />
    </div>
    <div class="form-group">
      <label for="currency">Currency: </label>
      <input type="text" id="currency" v-model="accountInfo.currency" class="white" disabled />
    </div>
    <div class="button-column">
      <button class="transfer-button" @click="transfer">Transfer Money</button>
      <button @click="goToCreateAccountPage">Back</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      accountInfo: {},
    };
  },
  created() {
    const accountInfoStr = this.$route.query.accountInfo;
    if (accountInfoStr) {
      this.accountInfo = JSON.parse(accountInfoStr);
      localStorage.setItem("accountCurrency", this.accountInfo.currency);
    } else {
      const accountInfo = localStorage.getItem("accountInfo");
      if (accountInfo) {
        this.accountInfo = JSON.parse(accountInfo);
        localStorage.setItem("accountCurrency", this.accountInfo.currency);
      }
    }
  },
  methods: {
    goToCreateAccountPage() {
      this.$router.push("/create-account");
    },
    fetchAccountDetails(accountId) {
      const accessToken = localStorage.getItem('access_token');

      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      axios.get(`http://localhost:8080/accounts/${accountId}`, config)
        .then(response => {

          const { id, owner, balance, currency } = response.data;
          this.accountId = id;
          this.accountName = owner;
          this.balance = balance;
          this.currency = currency;
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
    transfer() {
      this.$router.push('/transfer');
    },
  },
};
</script>

<style>
.account-container {
  max-width: 300px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border: 1px solid rgba(4, 30, 66, 0.1);
  background-color: rgba(4, 30, 66, 1.0);
  color: white;
  font-family: Catamaran, Helvetica, sans-serif;
}

.account-details {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.account-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 20px;
}

.account-item {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 10px;
}

.label {
  font-weight: bold;
}

.transfer-button {
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.transfer-button:hover {
  background-color: #0056b3;
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

.button-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}


.button-column button {
  margin-bottom: 10px;
}

.white {
  padding: 5px;
  background-color: white;
}
</style>

  