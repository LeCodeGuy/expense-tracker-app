// Import necessary modules
import assert from "assert";
import db from "../sql/database-connection.js";
import queries from "../services/expense-tracker-services.js";

// Create an instance of the queries service using the database connection
const query= queries(db);

// Test suite for the Expense Tracker App
describe("Expense Tracker App testing", function(){
    // Set a timeout for each test case
    this.timeout(6000);
    
    // Before each test, reset the database to ensure a clean state
    this.beforeEach(async function (){
        await query.reset();
    });
    
    // Test case: Adding an expense
    it("should be able to add an expense", async function (){
        // Add an expense to the database       
        await query.addExpense("Coffee", "weekday", 30);
        
        // Expected result after adding the expense
        const expected = [
                    {
                    id: 1,
                    expense: 'Coffee',
                    amount: '30',
                    total: '150',
                    category_id: 3
                    }
                ]
        // Retrieve all expenses and compare with the expected result
        let actual = await query.allExpenses();
        assert.deepEqual(expected,actual);
    });

    // Test case: Deleting a given expense
    it("should be able to delete a given expense", async function (){        
        // Add expenses to the database
        await query.addExpense("Coffee", "weekday", 30);
        await query.addExpense("Rent", "monthly", 5000);
        await query.addExpense("Groceries", "weekly", 1000);
        
        // Remove expenses from the database
        await query.deleteExpense("Coffee", "weekday");
        await query.deleteExpense("Groceries", "weekly");

        // Expected result after deleting expenses
        const expected = [
            {
                id:2,
                expense: 'Rent',
                amount: '5000',
                total: '5000',
                category_id: 6
                
            }
        ]

        // Retrieve all expenses and compare with the expected result
        let actual = await query.allExpenses();
        assert.deepEqual(expected,actual);
    });
    
    // Test case: Returning expenses for a specific category
    it("should return expenses for a specific category", async function (){        
        // Add expenses to the database
        await query.addExpense("Coffee", "weekday", 30);
        await query.addExpense("Rent", "monthly", 5000);
        await query.addExpense("Groceries", "weekly", 1000);
        await query.addExpense("Lunch", "weekday", 50);

        // Expected result for expenses in the "weekday" category
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
        
        // Retrieve expenses for the "weekday" category and compare with the expected result
        let actual = await query.expensesForCategory("weekday");
        assert.deepEqual(expected,actual);
    });

    // Test case: Returning the totals for all categories
    it("should return the totals for all the categories", async function (){        
        // Add expenses to the database
        await query.addExpense("Coffee", "weekday", 30);
        await query.addExpense("Rent", "monthly", 5000);
        await query.addExpense("Groceries", "weekly", 1000);
        await query.addExpense("Lunch", "weekday", 50);
        
        // Expected result for category totals
        let expected = [
            { category: 'weekday', total: '400' },
            { category: 'weekly', total: '4000' },
            { category: 'monthly', total: '5000' }
          ]

        // Retrieve category totals and compare with the expected result
        let actual = await query.categoryTotals();
        assert.deepEqual(expected,actual);
    });

    // Test case: Returning all expenses
    it("should return all expenses", async function (){        
        // Add expenses to the database
        await query.addExpense("Coffee", "weekday", 30);
        await query.addExpense("Rent", "monthly", 5000);
        await query.addExpense("Groceries", "weekly", 1000);
        
        // Expected result for all expenses
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

        // Retrieve all expenses and compare with the expected result
        let actual = await query.allExpenses();
        assert.deepEqual(expected,actual);
    });

    // After all tests, close the database connection
    this.afterAll(function () {
        db.$pool.end;
    });
});