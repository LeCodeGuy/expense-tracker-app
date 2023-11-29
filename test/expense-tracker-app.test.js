import assert from "assert";
import db from "../sql/database-connection.js";
import queries from "../services/expense-tracker-services.js";

const query= queries(db);

describe("Expense Tracker App testing", function(){
    this.timeout(6000);
    
    this.beforeEach(async function (){
        // TODO write logic to clear the expense table before each test
    });

    it("should be able to add an expense", async function (){        
        
    });

    it("should be able to delete a given expense", async function (){        
        
    });
    it("should return expenses for a specific category", async function (){        
        
    });

    it("should return the totals for all the categories", async function (){        
        
    });

    it("should return all expenses", async function (){        
        
    });

    this.afterAll(function () {
        db.$pool.end;
    });
});