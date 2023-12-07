<template>
  <div class="transfer-page">
    <h2>Transfer Money</h2>
    <div class="transfer-form">
      <div class="form-item">
        <label for="amount">Amount:</label>
        <input type="number" id="amount" v-model="amount" />
      </div>
      <div class="form-item">
        <label for="recipientId">Recipient Account ID:</label>
        <input type="text" id="recipientId" v-model="recipientId" />
      </div>
      <div class="form-item">
        <label>Currency:</label>
        <input type="text" id="currency" :value="transferCurrency" readonly />
      </div>
      <p v-if="statusMessage"
        :class="{ 'success-message': statusMessage.includes('successful'), 'error-message': statusMessage.includes('failed') }">
        {{ statusMessage }}</p>
    </div>
    <div class="buttons">
      <button @click="sendMoney">Send Money</button>
      <button @click="goToAccountPage">Return to Account Page</button>
    </div>
  </div>
</template>
  
<script>
import axios from 'axios';
export default {
  data() {
    return {
      recipientId: null,
      amount: null,
      transferCurrency: localStorage.getItem('accountCurrency'),
      statusMessage: '',
    };
  },
  methods: {
    goToAccountPage() {
      const accessToken = localStorage.getItem('access_token');
      const id = parseInt(localStorage.getItem('accountId'), 10);
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      axios.get(`http://localhost:8080/accounts/${id}`, config)
        .then(response => {
          const accountInfo = response.data;
          this.$router.push({
        path: '/account-info',
        query: { accountInfo: JSON.stringify(accountInfo) },
      });
        })
        .catch(error => {
          console.error("Error fetching account details:", error);
        });
    },
    sendMoney() {
      const accessToken = localStorage.getItem('access_token');
      const fromAccountId = parseInt(localStorage.getItem('accountId'), 10);
      const currency = localStorage.getItem('accountCurrency');
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const transferData = {
        from_account_id: fromAccountId,
        to_account_id: parseInt(this.recipientId, 10),
        amount: this.amount,
        currency: currency
      };
      console.log(transferData)
      axios.post(`http://localhost:8080/transfers`, transferData, config)
        .then(response => {
          console.log("Response data:", response.data);
          this.statusMessage = 'transfer successful!';
        })
        .catch(error => {
          console.error("Error fetching account details:", error);
          this.statusMessage = 'Transfer failed: the account you are sending to has a different currency.';
        });
      console.log("Sending money...");
    },
  },
};
</script>
  
<style>
.transfer-page {
  max-width: 300px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border: 1px solid rgba(4, 30, 66, 0.1);
  background-color: rgba(4, 30, 66, 1.0);
  color: white;
  font-family: Catamaran, Helvetica, sans-serif;
}

.transfer-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid #ccc;
  padding: 20px;
  margin-bottom: 20px;
}

.form-item {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 10px;
}

label {
  font-weight: bold;
}

.buttons {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.buttons {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.buttons button {
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 10px;
}

.buttons button:first-child {
  margin-bottom: 20px;
}

.buttons button:hover {
  background-color: #0056b3;
}
</style>