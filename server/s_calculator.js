//  מחשב חשבון כולל טיפ דינמיי
//  

// import { GROUP_ID_NONE } from "./constants";


class Group {
    constructor(id) {
        this.users = [];
        this.tipPercentage = 0;
        this.id = id;
    }


    AddUser(user) {
        //  Adds user only if they don't already exist
        let userExists = false;
        for (let i = 0; i < this.users.length; i++) {
            if (this.users[i].id == user.id) {
                userExists = true;
            }
        }
        if (!userExists) {
            this.users.push(user);
        }
    }

    Removeuser(userId) {
        for (let i = 0; i < this.users.length; i++) {
            if (this.users[i].id == userId) {
                this.users.splice(i, 1);
            }
        }
    }

    GetTotalAmount() {
        let totalAmount = 0;
        this.users.forEach(user => {
            totalAmount += user.amount;
        })
        return totalAmount;
    }
    GetTotalBill() {
        let totalBill = 0;
        this.users.forEach(user => {
            totalBill += user.bill;
        })
        return totalBill;
    }

    GetTipAmount() { return this.GetTotalBill() * (this.tipPercentage / 100) }

    CalculateChangeForAll() {
        let userCount = this.users.length;

        this.users.forEach(user => {
            let change = 0;
            let tip = this.GetTipAmount();
            let bill = user.bill;
            let amount = user.amount;

            change = amount - (tip / userCount + bill);// Deduct the individual tip from the payment
            change = +change.toFixed(2);//  Round to two decimal place
            user.SetChange(change)
        })
    }

    CalculateBillWithTipForAll() {
        let userCount = this.users.length;

        this.users.forEach(user => {
            let billWithTip = 0;
            let tip = this.GetTipAmount();
            let bill = user.bill;

            billWithTip = tip / userCount + bill;// Deduct the individual tip from the payment
            billWithTip = +billWithTip.toFixed(2);//  Round to two decimal place
            user.SetBill(billWithTip)
        })
    }
}

class User {
    constructor(id, amount, bill, isManager) {
        this.id = id;
        this.amount = amount;
        this.bill = bill;
        this.change = 0;
        this.isManager = isManager;
        this.isInAnyGroup = false;
    }

    CalculateChange() {
        this.change = this.amount - this.bill;
        return this.change;
    }
    SetChange(change) {
        this.change = change;
    }
    SetBill(bill) {
        this.bill = bill;
    }
}

module.exports = { Group, User }