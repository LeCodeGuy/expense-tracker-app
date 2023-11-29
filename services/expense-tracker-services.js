export default function queries(db){
    // methods for the landing page
    async function categoryTotals(){
        // TODO add logic to return the totals for each category
        // TODO and return it for use with handlebars on the landing page 
    }

    async function expensesForCategory(categotyId){
        // TODO add logic to filter expenses for a specific category
    }

    async function addExpense(categoryId, amount){
        // TODO add logic to store the expense to the database when the add expense button is clicked
    }
    
    // methods for the all expenses page
    async function allExpenses(){
        // TODO add logic to return all expenses including category for the detailed expense page
    }

    async function deleteExpense(expenseId){
        // TODO add logic to remove a specific expense based on it's ID 
        // TODO when the delete button is clicked on the detailed expense page
    }

    return{
        categoryTotals,
        addExpense,
        expensesForCategory,
        allExpenses,
        deleteExpense        
    }
}