//  מחשב חשבון כולל טיפ דינמיי
//  
class Group {
    constructor() {
        this.members = [];
        this.tipPercentage = 0;
    }


    AddMember(member) {
        //  Adds member only if they don't already exist
        let memberExists = false;
        for (let i = 0; i < this.members.length; i++) {
            if (this.members[i].id == member.id) {
                memberExists = true;
            }
        }
        if (!memberExists) {
            this.members.push(member);
        }
    }
    RemoveMember(member) {
        for (let i = 0; i < this.members.length; i++) {
            if (this.members[i].id == member.id) {
                this.members.splice(i, 1);
            }
        }
    }
    UpdateMember(member, amount, bill) {
        for (let i = 0; i < this.members.length; i++) {
            if (this.members[i].id == member.id) {
                this.members[i].amount = amount;
                this.members[i].bill = bill;
            }
        }
    }

    GetTotalAmount() {
        let totalAmount = 0;
        this.members.forEach(member => {
            totalAmount += member.amount;
        })
        return totalAmount;
    }
    GetTotalBill() {
        let totalBill = 0;
        this.members.forEach(member => {
            totalBill += member.bill;
        })
        return totalBill;
    }

    GetTipAmount() { return this.GetTotalBill() * (this.tipPercentage / 100) }

    CalculateChangeForAll() {
        let memberCount = this.members.length;

        this.members.forEach(member => {
            let change = 0;
            let tip = this.GetTipAmount();
            let bill = member.bill;
            let amount = member.amount;

            change = amount - (tip / memberCount + bill);// Deduct the individual tip from the payment
            change = +change.toFixed(2);//  Round to two decimal place
            member.SetChange(change)
        })
    }
    CalculateBillWithTipForAll() {
        let memberCount = this.members.length;

        this.members.forEach(member => {
            let billWithTip = 0;
            let tip = this.GetTipAmount();
            let bill = member.bill;

            billWithTip = tip / memberCount + bill;// Deduct the individual tip from the payment
            billWithTip = +billWithTip.toFixed(2);//  Round to two decimal place
            member.SetBill(billWithTip)
        })
    }
}

class Member {
    constructor(id, amount, bill) {
        this.id = id;
        this.amount = amount;
        this.bill = bill;
        this.change = 0;
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

module.exports = { Group, Member }