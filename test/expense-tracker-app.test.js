import assert from "assert";
import db from "../sql/database-connection.js";
import queries from "../services/expense-tracker-services.js";

const query= queries(db);

describe("Expense Tracker App testing", function(){
    this.timeout(6000);
    
    this.beforeEach(async function (){
        await query.reset();
    });

    it("should be able to add an expense", async function (){        
        await query.addExpense("Coffee", "weekday", 30);
        
        const expected = [
                    {
                    id: 1,
                    expense: 'Coffee',
                    amount: '30',
                    total: '150',
                    category_id: 3
                    }
                ]
        let actual = await query.allExpenses();
        
        assert.deepEqual(expected,actual);
    });

    it("should be able to delete a given expense", async function (){        
        // add expenses
        await query.addExpense("Coffee", "weekday", 30);
        await query.addExpense("Rent", "monthly", 5000);
        await query.addExpense("Groceries", "weekly", 1000);
        
        // remove expense
        await query.deleteExpense("Coffee", "weekday");
        await query.deleteExpense("Groceries", "weekly");

        const expected = [
            {
                id:2,
                expense: 'Rent',
                amount: '5000',
                total: '5000',
                category_id: 6
                
            }
        ]

        let actual = await query.allExpenses();

        assert.deepEqual(expected,actual);
    });
    it("should return expenses for a specific category", async function (){        
        // add expenses
        await query.addExpense("Coffee", "weekday", 30);
        await query.addExpense("Rent", "monthly", 5000);
        await query.addExpense("Groceries", "weekly", 1000);
        await query.addExpense("Lunch", "weekday", 50);

        const expected = [
                {
                    expense: 'Coffee',
                    total: '150'
                },
                {
                    expense: 'Lunch',
                    total: '250'
                }
            ]

        let actual = await query.expensesForCategory("weekday");

        assert.deepEqual(expected,actual);
    });

    it("should return the totals for all the categories", async function (){        
        // add expenses
        await query.addExpense("Coffee", "weekday", 30);
        await query.addExpense("Rent", "monthly", 5000);
        await query.addExpense("Groceries", "weekly", 1000);
        await query.addExpense("Lunch", "weekday", 50);
        
        let expected = [
            { category: 'weekday', total: '400' },
            { category: 'weekly', total: '4000' },
            { category: 'monthly', total: '5000' }
          ]

        let actual = await query.categoryTotals();

        assert.deepEqual(expected,actual);
    });

    it("should return all expenses", async function (){        
        await query.addExpense("Coffee", "weekday", 30);
        await query.addExpense("Rent", "monthly", 5000);
        await query.addExpense("Groceries", "weekly", 1000);
        
        const expected = [
            {
                id: 1,
                expense: 'Coffee',
                amount: '30',
                total: '150',
                category_id: 3
            },
            {
                id:2,
                expense: 'Rent',
                amount: '5000',
                total: '5000',
                category_id: 6
                
            },
            {
                id:3,
                expense: 'Groceries',
                amount: '1000',
                total: '4000',
                category_id: 5
                
            }
        ]

        let actual = await query.allExpenses();

        assert.deepEqual(expected,actual);
    });

    this.afterAll(function () {
        db.$pool.end;
    });
});