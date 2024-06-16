// document.addEventListener('DOMContentLoaded', () => {
//     const transactionForm = document.getElementById('transactionForm');
//     const transactionTable = document.getElementById('transactionTable').querySelector('tbody');

//     // Fetch all transactions on page load
//     fetchTransactions();

//     // Form submission handler
//     transactionForm.addEventListener('submit', async (e) => {
//         e.preventDefault();

//         const formData = new FormData(transactionForm);
//         const type = formData.get('type');
//         const amount = formData.get('amount');
//         const description = formData.get('description');
//         const date = formData.get('date');

//         try {
//             const response = await fetch('/api/transactions', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify({ type, amount, description, date })
//             });

//             if (!response.ok) {
//                 throw new Error('Failed to add transaction');
//             }

//             const newTransaction = await response.json();
//             appendTransaction(newTransaction);
//             transactionForm.reset();
//         } catch (error) {
//             console.error('Error adding transaction:', error.message);
//             alert('Failed to add transaction. Please try again.');
//         }
//     });

//     // Function to fetch all transactions from server
//     async function fetchTransactions() {
//         try {
//             const response = await fetch('/api/transactions');
//             if (!response.ok) {
//                 throw new Error('Failed to fetch transactions');
//             }
//             const transactions = await response.json();
//             transactions.forEach(transaction => appendTransaction(transaction));
//         } catch (error) {
//             console.error('Error fetching transactions:', error.message);
//             alert('Failed to fetch transactions. Please refresh the page.');
//         }
//     }

//     // Fnction to append a transaction to the table
//     function appendTransaction(transaction) {
//         const row = document.createElement('tr');
//         row.dataset.id = transaction.id; // Set dataset.id attribute for identification

//         row.innerHTML = `
//             <td>${transaction.id}</td>
//             <td>${transaction.type}</td>
//             <td>${transaction.amount}</td>
//             <td>${transaction.description}</td>
//             <td>${transaction.date}</td>
//             <td><button class="deleteButton">Delete</button></td>
//         `;
//         transactionTable.appendChild(row);

//         // Attach event listener to the Delete button within this row
//         const deleteButton = row.querySelector('.deleteButton');
//         deleteButton.addEventListener('click', () => deleteTransaction(transaction.id));
//     }

//     async function deleteTransaction(transactionId) {
//         try {
//             const response = await fetch(`/api/transactions/${transactionId}`, {
//                 method: 'DELETE'
//             });

//             if (!response.ok) {
//                 throw new Error('Failed to delete transaction');
//             }

//             // Assuming server responds with JSON indicating success
//             const responseData = await response.json();
//             console.log('Server response:', responseData);

//             // Remove the deleted transaction row from the table
//             const transactionRow = document.querySelector(`tr[data-id="${transactionId}"]`);
//             if (transactionRow) {
//                 transactionRow.remove();
//             }
//         } catch (error) {
//             console.error('Error deleting transaction:', error.message);
//             alert('Failed to delete transaction. Please try again.');
//         }
//     }
// });

document.addEventListener('DOMContentLoaded', () => {
    const transactionForm = document.getElementById('transactionForm');
    const transactionTable = document.getElementById('transactionTable').querySelector('tbody');

    // Fetch all transactions on page load
    fetchTransactions();

    // Form submission handler
    transactionForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(transactionForm);
        const type = formData.get('type');
        const amount = formData.get('amount');
        const description = formData.get('description');
        const date = formData.get('date');

        try {
            const response = await fetch('/api/transactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ type, amount, description, date })
            });

            if (!response.ok) {
                throw new Error('Failed to add transaction');
            }

            const newTransaction = await response.json();
            appendTransaction(newTransaction);
            transactionForm.reset();
        } catch (error) {
            console.error('Error adding transaction:', error.message);
            alert('Failed to add transaction. Please try again.');
        }
    });

    // Function to fetch all transactions from server
    async function fetchTransactions() {
        try {
            const response = await fetch('/api/transactions');
            if (!response.ok) {
                throw new Error('Failed to fetch transactions');
            }
            const transactions = await response.json();
            console.log('Fetched transactions:', transactions); // Log fetched transactions
            transactions.forEach(transaction => appendTransaction(transaction));
        } catch (error) {
            console.error('Error fetching transactions:', error.message);
            alert('Failed to fetch transactions. Please refresh the page.');
        }
    }

    // Function to append a transaction to the table
    function appendTransaction(transaction) {
        const row = document.createElement('tr');
        row.dataset.id = transaction.id; // Set dataset.id attribute for identification

        row.innerHTML = `
            <td>${transaction.id}</td>
            <td>${transaction.type}</td>
            <td>${transaction.amount}</td>
            <td>${transaction.description}</td>
            <td>${transaction.date}</td>
            <td><button class="deleteButton">Delete</button></td>
        `;
        transactionTable.appendChild(row);

        // Attach event listener to the Delete button within this row
        const deleteButton = row.querySelector('.deleteButton');
        deleteButton.addEventListener('click', () => deleteTransaction(transaction.id));
    }

    async function deleteTransaction(transactionId) {
        try {
            const response = await fetch(`/api/transactions/${transactionId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete transaction');
            }

            // Assuming server responds with JSON indicating success
            const responseData = await response.json();
            console.log('Server response:', responseData);

            // Remove the deleted transaction row from the table
            const transactionRow = document.querySelector(`tr[data-id="${transactionId}"]`);
            if (transactionRow) {
                transactionRow.remove();
            }
        } catch (error) {
            console.error('Error deleting transaction:', error.message);
            alert('Failed to delete transaction. Please try again.');
        }
    }
});
