// This module exports functions that provide various queries for interacting with the database
export default function queries(db){
    
    // Retrieve category totals from the expense table
    async function categoryTotals(){
        return await db.any(`SELECT category_type AS category, SUM(e.total) AS total 
                            FROM expense AS e 
                            JOIN categories AS c 
                                ON e.category_id = c.id 
                            GROUP BY c.category_type,e.category_id
                            ORDER BY e.category_id`);
    }

    // Retrieve expenses for a specific category or all categories
    async function expensesForCategory(category){
        if(category === undefined || category === 'All'){
            // Return all records if no specific category is provided
            return await db.any(`SELECT expense,total FROM expense AS e JOIN categories AS c ON e.category_id = c.id`);
        }
        else{
            // Return records for the specified category
            return await db.any(`SELECT expense,total FROM expense AS e JOIN categories AS c ON e.category_id = c.id WHERE category_type = $1`,category);
        }  
    }
    
    // Add a new expense to the database
    async function addExpense(expense, category, amount){
        let total
        // Calculate total based on the selected category
        switch (category) {
            case 'daily':
              total = amount*30;
              break;
            case 'weekend':
                total = amount*2;
              break;
            case 'weekly':
                total = amount*4;
                break;
            case 'weekday':
                total = amount*5;
                break;
            default:
              total = amount;
        }
        
        // Insert the expense into the database
        await db.none(`INSERT INTO expense (expense, amount, total, category_id)
            VALUES ($1, $2, $3, (SELECT id FROM categories WHERE category_type = $4))`,
            [expense, amount, total, category]);
    }
    
    // Retrieve all expenses from the expense table
    async function allExpenses(){
        return db.any(`SELECT * FROM expense AS e JOIN categories AS c ON category_id = c.id ORDER BY e.ID`);
    }

    // Delete a specific expense based on expense name and category
    async function deleteExpense(expense,category){
        await db.none(`DELETE FROM expense WHERE expense = $1 AND category_id = (SELECT id FROM categories WHERE category_type = $2)`,[expense,category]);
    }

    // Reset the expense table by truncating it
    async function reset(){
        await db.none('TRUNCATE TABLE expense RESTART IDENTITY CASCADE');
    }
    
    async function allCategories(){
        return await db.any(`SELECT category_type AS category 
                        FROM categories  
                        ORDER BY id`);
    }
    async function totalExpense(){
        let result = await db.oneOrNone(`SELECT SUM(total) AS total FROM Expense`);
        // result = parseFloat(result.total).toFixed(2);
        return result;

    }
    // Return the public API of the module
    return{
        allCategories,
        totalExpense,
        categoryTotals,
        addExpense,
        expensesForCategory,
        allExpenses,
        deleteExpense,
        reset      
    }
}