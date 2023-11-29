export default function queries(db){
    // methods for the landing page
    async function categoryTotals(){
        return await db.any(`SELECT category_type AS category, SUM(e.total) AS total 
                            FROM expense AS e 
                            JOIN categories AS c 
                                ON e.category_id = c.id 
                            GROUP BY c.category_type,e.category_id
                            ORDER BY e.category_id`);
    }

    async function expensesForCategory(category){
        if(category === undefined || category === 'All'){
            // return all records
            return await db.any(`SELECT expense,total FROM expense AS e JOIN categories AS c ON e.category_id = c.id`);
        }
        else{
            // return records for the specified category
            return await db.any(`SELECT expense,total FROM expense AS e JOIN categories AS c ON e.category_id = c.id WHERE category_type = $1`,category);
        }  
    }

    async function addExpense(expense, category, amount){
        // TODO add logic to store the expense to the database when the add expense button is clicked
        let total
        
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
        
        await db.none(`INSERT INTO expense (expense, amount, total, category_id)
            VALUES ($1, $2, $3, (SELECT id FROM categories WHERE category_type = $4))`,
            [expense, amount, total, category]);
    }
    
    // methods for the all expenses page
    async function allExpenses(){
        return db.any(`SELECT * FROM expense ORDER BY ID`);
    }

    async function deleteExpense(expense,category){
        await db.none(`DELETE FROM expense WHERE expense = $1 AND category_id = (SELECT id FROM categories WHERE category_type = $2)`,[expense,category]);
    }
    async function reset(){
        await db.none('TRUNCATE TABLE expense RESTART IDENTITY CASCADE');
    }

    return{
        categoryTotals,
        addExpense,
        expensesForCategory,
        allExpenses,
        deleteExpense,
        reset      
    }
}